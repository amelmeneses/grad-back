// services/reservaService.js
const Reserva = require('../models/reservaModel');

exports.crearReserva = (datos) => Reserva.create(datos);

exports.obtenerPorUsuario = (usuarioId) =>
  Reserva.findAll({
    where: { usuario_id: usuarioId },
    include: ['cancha']
  });
