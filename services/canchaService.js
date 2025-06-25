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
  addMonths,
  parseISO
} = require('date-fns');

// Helper para convertir nombre de día en inglés a número ISO (0 = domingo, 6 = sábado)
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
    raw: true
  });

  reservas.forEach(r => {
    r.fecha = parseISO(r.fecha);
  });

  const hoy = startOfDay(new Date());
  const fin = addMonths(hoy, 1);
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

    let totalMinutosFuncionamiento = 0;
    let totalMinutosReservados = 0;

    ventanas.forEach((ventana) => {
      const [hInicio, mInicio] = ventana.hora_apertura.split(':').map(Number);
      const [hFin, mFin] = ventana.hora_cierre.split(':').map(Number);
      totalMinutosFuncionamiento += (hFin * 60 + mFin) - (hInicio * 60 + mInicio);
    });

    reservasEnFecha.forEach((r) => {
      const [hInicio, mInicio] = r.hora_inicio.split(':').map(Number);
      const [hFin, mFin] = r.hora_fin.split(':').map(Number);
      totalMinutosReservados += (hFin * 60 + mFin) - (hInicio * 60 + mInicio);
    });

    if (totalMinutosReservados >= totalMinutosFuncionamiento) {
      disponibilidad[yyyyMM].no_disponibles.push(fechaStr);
    } else {
      disponibilidad[yyyyMM].disponibles.push(fechaStr);
    }
  }

  return disponibilidad;
};
