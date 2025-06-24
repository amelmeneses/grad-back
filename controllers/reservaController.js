// controllers/reservaController.js
const reservaService = require('../services/reservaService');

exports.crear = async (req, res, next) => {
  try {
    const nueva = await reservaService.crearReserva({
      ...req.body,
      usuario_id: req.user.id
    });
    res.status(201).json(nueva);
  } catch (err) {
    next(err);
  }
};

exports.misReservas = async (req, res, next) => {
  try {
    const reservas = await reservaService.obtenerPorUsuario(req.user.id);
    res.json(reservas);
  } catch (err) {
    next(err);
  }
};
