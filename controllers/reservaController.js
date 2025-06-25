// controllers/reservaController.js
const reservaService = require('../services/reservaService');
const { Usuario }     = require('../models/userModel');

/**
 * POST /reservas
 */
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

/**
 * GET /mis-reservas
 */
exports.misReservas = async (req, res, next) => {
  try {
    const reservas = await reservaService.obtenerPorUsuario(req.user.id);
    res.json(reservas);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /reservas
 * - Admin (role 1): devuelve todas.
 * - Empresa (role 3): devuelve solo las reservas de las canchas
 *   de todas sus empresas.
 */
exports.listarReservas = async (req, res, next) => {
  try {
    if (req.user.role === 1) {
      const all = await reservaService.obtenerTodas();
      return res.json(all);
    }
    if (req.user.role === 3) {
      const reservas = await reservaService.obtenerPorEmpresasUsuario(req.user.id);
      return res.json(reservas);
    }
    return res.status(403).json({ message: 'Access denied.' });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /reservas/:id/cancel
 */
exports.cancelar = async (req, res, next) => {
  try {
    const actualizado = await reservaService.cancelarReserva(req.params.id);
    if (!actualizado) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }
    res.json({ message: 'Reserva cancelada exitosamente' });
  } catch (err) {
    next(err);
  }
};
