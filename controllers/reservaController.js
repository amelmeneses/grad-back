// controllers/reservaController.js
const reservaService = require('../services/reservaService');
const { Usuario }     = require('../models/userModel');

/**
 * POST /reservas
 */
exports.crear = async (req, res, next) => {
  try {
    const { bloques, cancha_id, fecha } = req.body;
    if (!bloques || !cancha_id || !fecha) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    const nuevas = await reservaService.crearReserva({
      bloques,
      cancha_id,
      fecha,
      usuario_id: req.user.id,
      estado: 'pending'
    });

    res.status(201).json(nuevas);
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

exports.obtenerTotalPago = async (req, res) => {
  const { canchaId } = req.params;
  const { ids } = req.query;

  if (!ids) {
    return res.status(400).json({ message: 'IDs de reservas no proporcionados' });
  }

  try {
    const idsArray = ids.split(',').map(Number);
    const resultado = await reservaService.calcularTotalPago(canchaId, idsArray);
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Error calculando total de pago' });
  }
};

exports.marcarReservasComoPagadas = async (req, res) => {
  const { ReservasIds } = req.query;
  if (!ReservasIds) {
    return res.status(400).json({ message: 'No se proporcionaron IDs' });
  }

  try {
    const ids = ReservasIds.split(',').map(Number);
    const reservasActualizadas = await reservaService.actualizarReservasPagadas(ids);
    res.json(reservasActualizadas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error actualizando estado de reservas' });
  }
};
