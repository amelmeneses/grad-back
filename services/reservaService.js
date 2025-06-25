// services/reservaService.js
const { Reserva } = require('../models/reservaModel');
const { Usuario } = require('../models/userModel');
const { Empresa } = require('../models/empresaModel');
const { Cancha }  = require('../models/canchaModel');

// Utilidad para agrupar bloques consecutivos
function agruparBloques(bloques) {
  // Asegurarse de que todos los bloques tengan los campos necesarios
  const bloquesOrdenados = bloques
    .map(b => ({
      hora_inicio: b.hora_inicio.trim(),
      hora_fin: b.hora_fin.trim()
    }))
    .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

  const grupos = [];
  let actual = bloquesOrdenados[0];

  for (let i = 1; i < bloquesOrdenados.length; i++) {
    if (bloquesOrdenados[i].hora_inicio === actual.hora_fin) {
      // Son consecutivos, extender el grupo
      actual.hora_fin = bloquesOrdenados[i].hora_fin;
    } else {
      // Nuevo grupo
      grupos.push({ ...actual });
      actual = bloquesOrdenados[i];
    }
  }
  grupos.push({ ...actual });

  return grupos;
}

// Crear reservas agrupadas
exports.crearReserva = async ({ bloques, cancha_id, usuario_id, fecha, estado = 'pending' }) => {
  if (!Array.isArray(bloques) || bloques.length === 0) throw new Error('No hay bloques a reservar');

  const reservasAGuardar = agruparBloques(bloques).map(b => ({
    cancha_id,
    usuario_id,
    fecha,
    hora_inicio: b.hora_inicio,
    hora_fin: b.hora_fin,
    estado,
  }));

  return Reserva.bulkCreate(reservasAGuardar);
};

// Reservas de un usuario
exports.obtenerPorUsuario = usuarioId =>
  Reserva.findAll({
    where: { usuario_id: usuarioId },
    include: ['cancha'],
  });

// Todas las reservas con usuario y cancha
exports.obtenerTodas = () =>
  Reserva.findAll({
    include: ['usuario', 'cancha'],
  });

// Reservas de las canchas de todas las empresas del usuario
exports.obtenerPorEmpresasUsuario = async usuarioId => {
  const usuario = await Usuario.findByPk(usuarioId, {
    include: [{
      model: Empresa,
      as: 'Empresas',
      include: [{ model: Cancha, as: 'Canchas' }]
    }]
  });
  if (!usuario) return [];

  const canchaIds = usuario.Empresas.flatMap(emp => emp.Canchas.map(c => c.id));
  if (canchaIds.length === 0) return [];

  return Reserva.findAll({
    where: { cancha_id: canchaIds },
    include: ['usuario', 'cancha'],
  });
};

// Marcar reserva como cancelada
exports.cancelarReserva = async id => {
  const [updatedCount] = await Reserva.update(
    { estado: 'canceled' },
    { where: { id } }
  );
  return updatedCount;
};

const { Op } = require('sequelize');

// Cancelar reservas pendientes creadas hace más de 15 minutos
exports.cancelarReservasExpiradas = async () => {
  const { Op } = require('sequelize');
  const { Reserva } = require('../models/reservaModel');

  const hace15Min = new Date(Date.now() - 15 * 60 * 1000);

  const [cantidad] = await Reserva.update(
    { estado: 'canceled' },
    {
      where: {
        estado: 'pending',
        createdAt: { [Op.lt]: hace15Min }
      }
    }
  );

  return cantidad;
};

exports.calcularTotalPago = async (canchaId, reservasIdsArray) => {
  const { Reserva } = require('../models/reservaModel');
  const { Cancha } = require('../models/canchaModel');

  const reservas = await Reserva.findAll({
    where: {
      id: reservasIdsArray,
      cancha_id: canchaId
    }
  });

  const cancha = await Cancha.findByPk(canchaId, {
    include: ['tarifas']
  });
  console.log("CANCHA", cancha);

  const tarifa = cancha?.tarifas?.find(t => t.es_default);
  if (!tarifa) throw new Error('Tarifa por defecto no encontrada');

  let totalHoras = 0;
  for (const r of reservas) {
    const hIni = new Date(`1970-01-01T${r.hora_inicio}`);
    const hFin = new Date(`1970-01-01T${r.hora_fin}`);
    const horas = (hFin - hIni) / (1000 * 60 * 60);
    totalHoras += horas;
  }

  const total = +(totalHoras * tarifa.tarifa).toFixed(2);
  const subtotal = +(total / 1.15).toFixed(2);
  const iva = +(total - subtotal).toFixed(2);

  return {
    total,
    subtotal,
    iva,
    reservas: reservas.map(r => ({
      id: r.id,
      hora_inicio: r.hora_inicio,
      hora_fin: r.hora_fin
    }))
  };
};

exports.actualizarReservasPagadas = async (ids) => {
  await Reserva.update({ estado: 'paid' }, { where: { id: ids } });
  const reservas = await Reserva.findAll({ where: { id: ids } });
  return reservas;
};
