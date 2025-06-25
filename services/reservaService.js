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
