// services/reservaService.js
const { Reserva } = require('../models/reservaModel');
const { Usuario } = require('../models/userModel');
const { Empresa } = require('../models/empresaModel');
const { Cancha }  = require('../models/canchaModel');

// Crear reserva
exports.crearReserva = datos =>
  Reserva.create(datos);

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
  // Cargar usuario con sus empresas y canchas
  const usuario = await Usuario.findByPk(usuarioId, {
    include: [{
      model: Empresa,
      as: 'Empresas',
      include: [{ model: Cancha, as: 'Canchas' }]
    }]
  });
  if (!usuario) return [];

  // IDs de canchas
  const canchaIds = usuario.Empresas
    .flatMap(emp => emp.Canchas.map(c => c.id));
  if (canchaIds.length === 0) return [];

  // Buscar reservas
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
