// backend/services/canchaService.js
const { Cancha } = require('../models/canchaModel');
const { TarifaAlquiler } = require('../models/tarifaAlquilerModel');
const { Reserva } = require('../models/reservaModel');
const { HorarioFuncionamiento } = require('../models/horarioFuncionamientoModel');
const { Op } = require('sequelize');
const {
  eachDayOfInterval,
  format,
  startOfDay,
  parseISO,
  endOfMonth,
  addMonths
} = require('date-fns');

const diasSemana = {
  'sunday': 0,
  'monday': 1,
  'tuesday': 2,
  'wednesday': 3,
  'thursday': 4,
  'friday': 5,
  'saturday': 6,
};

exports.getAll = () => Cancha.findAll();

exports.getByEmpresa = (empresaId) =>
  Cancha.findAll({ where: { empresa_id: empresaId } });

exports.getById = (id) => Cancha.findByPk(id);

exports.create = (data) => Cancha.create(data);

exports.updateById = (id, data) =>
  Cancha.update(data, { where: { id }, returning: true }).then(([_, rows]) => rows[0]);

exports.deleteById = (id) => Cancha.destroy({ where: { id } });

exports.cambiarEstadoCancha = async (id, nuevoEstado) => {
  const cancha = await Cancha.findByPk(id);
  if (!cancha) {
    const err = new Error('Cancha no encontrada');
    err.status = 404;
    throw err;
  }
  cancha.estado = nuevoEstado;
  await cancha.save();
  return cancha;
};

exports.getActivasPorDeporte = (deporte) =>
  Cancha.findAll({
    where: { deporte, estado: 1 },
    include: [
      {
        model: TarifaAlquiler,
        as: 'tarifas',
        where: { default: 1 },
        required: false,
      },
    ],
  });

exports.getCanchaParaReserva = (id) =>
  Cancha.findByPk(id, {
    include: [
      {
        model: TarifaAlquiler,
        as: 'tarifas',
        where: { default: 1 },
        required: false,
      },
    ],
  });

exports.getDisponibilidad = async (canchaId) => {
  const cancha = await Cancha.findByPk(canchaId);
  if (!cancha) throw new Error('Cancha no encontrada');

  const horarios = await HorarioFuncionamiento.findAll({
    where: { cancha_id: canchaId },
  });

  const reservas = await Reserva.findAll({
    where: {
      cancha_id: canchaId,
      estado: { [Op.in]: ['pending', 'paid'] },
    },
    raw: true,
  });

  reservas.forEach(r => {
    r.fecha = parseISO(r.fecha);
  });

  const hoy = startOfDay(new Date());
  const fin = endOfMonth(addMonths(hoy, 1));
  const dias = eachDayOfInterval({ start: hoy, end: fin });

  const disponibilidad = {};
  for (const dia of dias) {
    const yyyyMM = format(dia, 'yyyy-MM');
    const fechaStr = format(dia, 'yyyy-MM-dd');
    const diaSemana = dia.getDay();

    if (!disponibilidad[yyyyMM]) {
      disponibilidad[yyyyMM] = {
        disponibles: [],
        no_disponibles: [],
      };
    }

    const ventanas = horarios.filter(
      (h) => diasSemana[h.dia_semana.toLowerCase()] === diaSemana
    );

    if (ventanas.length === 0) {
      disponibilidad[yyyyMM].no_disponibles.push(fechaStr);
      continue;
    }

    const reservasEnFecha = reservas.filter(
      (r) => format(r.fecha, 'yyyy-MM-dd') === fechaStr
    );

    let algunaVentanaDisponible = false;

    for (const ventana of ventanas) {
      const [vhInicio, vmInicio] = ventana.hora_apertura.split(':').map(Number);
      const [vhFin, vmFin] = ventana.hora_cierre.split(':').map(Number);
      const inicioVentana = vhInicio * 60 + vmInicio;
      const finVentana = vhFin * 60 + vmFin;

      // Creamos un array de 1440 minutos del día y marcamos la ventana como 1
      const minutosDisponibles = new Array(1440).fill(0);
      for (let i = inicioVentana; i < finVentana; i++) {
        minutosDisponibles[i] = 1;
      }

      // Marcamos en 0 los minutos ocupados por reservas
      for (const r of reservasEnFecha) {
        const [rhInicio, rmInicio] = r.hora_inicio.split(':').map(Number);
        const [rhFin, rmFin] = r.hora_fin.split(':').map(Number);
        const inicioReserva = rhInicio * 60 + rmInicio;
        const finReserva = rhFin * 60 + rmFin;

        for (let i = Math.max(inicioReserva, inicioVentana); i < Math.min(finReserva, finVentana); i++) {
          minutosDisponibles[i] = 0;
        }
      }

      const tieneMinutosDisponibles = minutosDisponibles.slice(inicioVentana, finVentana).includes(1);
      if (tieneMinutosDisponibles) {
        algunaVentanaDisponible = true;
        break;
      }
    }

    if (algunaVentanaDisponible) {
      disponibilidad[yyyyMM].disponibles.push(fechaStr);
    } else {
      disponibilidad[yyyyMM].no_disponibles.push(fechaStr);
    }
  }

  return disponibilidad;
};

// Nueva función en services/canchaService.js
exports.getDisponibilidadByDate = async (canchaId, dateStr) => {
  const cancha = await Cancha.findByPk(canchaId);
  if (!cancha) throw new Error('Cancha no encontrada');

  const fecha = parseISO(dateStr);
  const diaSemana = fecha.getDay();
  const horarios = await HorarioFuncionamiento.findAll({
    where: { cancha_id: canchaId },
  });

  const reservas = await Reserva.findAll({
    where: {
      cancha_id: canchaId,
      estado: { [Op.in]: ['pending', 'paid'] },
      fecha: dateStr,
    },
    raw: true,
  });

  const ventanas = horarios.filter(
    (h) => diasSemana[h.dia_semana.toLowerCase()] === diaSemana
  );

  const horariosDisponibles = [];

  for (const ventana of ventanas) {
    const [vhInicio, vmInicio] = ventana.hora_apertura.split(':').map(Number);
    const [vhFin, vmFin] = ventana.hora_cierre.split(':').map(Number);
    const inicioVentana = vhInicio * 60 + vmInicio;
    const finVentana = vhFin * 60 + vmFin;

    // Minutos disponibles en el día para esta ventana
    const minutosDisponibles = new Array(1440).fill(0);
    for (let i = inicioVentana; i < finVentana; i++) {
      minutosDisponibles[i] = 1;
    }

    for (const r of reservas) {
      const [rhInicio, rmInicio] = r.hora_inicio.split(':').map(Number);
      const [rhFin, rmFin] = r.hora_fin.split(':').map(Number);
      const inicioReserva = rhInicio * 60 + rmInicio;
      const finReserva = rhFin * 60 + rmFin;

      for (let i = Math.max(inicioReserva, inicioVentana); i < Math.min(finReserva, finVentana); i++) {
        minutosDisponibles[i] = 0;
      }
    }

    // Crear slots de 30 minutos disponibles
    for (let start = inicioVentana; start + 30 <= finVentana; start += 30) {
      const slotLibre = minutosDisponibles.slice(start, start + 30).every(min => min === 1);
      if (slotLibre) {
        const hIni = `${String(Math.floor(start / 60)).padStart(2, '0')}:${String(start % 60).padStart(2, '0')}`;
        const hFin = `${String(Math.floor((start + 30) / 60)).padStart(2, '0')}:${String((start + 30) % 60).padStart(2, '0')}`;
        horariosDisponibles.push({ hora_inicio: hIni, hora_fin: hFin });
      }
    }
  }

  return { fecha: dateStr, horarios: horariosDisponibles };
};
