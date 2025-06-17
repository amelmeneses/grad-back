
// backend/controllers/tarifaAlquilerController.js
const tarifaService = require('../services/tarifaAlquilerService');

exports.listarTarifas = async (req, res, next) => {
  try {
    const canchaId = req.query.cancha_id;
    const tarifas = await tarifaService.getAllTarifas(canchaId);
    res.json(tarifas);
  } catch (err) {
    next(err);
  }
};

exports.obtenerTarifa = async (req, res, next) => {
  try {
    const tarifa = await tarifaService.getTarifaById(req.params.id);
    res.json(tarifa);
  } catch (err) {
    next(err);
  }
};

exports.crearTarifa = async (req, res, next) => {
  try {
    const nueva = await tarifaService.createTarifa(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    next(err);
  }
};

exports.actualizarTarifa = async (req, res, next) => {
  try {
    const updated = await tarifaService.updateTarifaById(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.eliminarTarifa = async (req, res, next) => {
  try {
    await tarifaService.deleteTarifaById(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
