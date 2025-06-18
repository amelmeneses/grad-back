// backend/controllers/tarifaAlquilerController.js
const tarifaService = require('../services/tarifaAlquilerService');

exports.listarTarifas = async (req, res, next) => {
  try {
    const tarifas = await tarifaService.getAllTarifas(req.params.canchaId);
    res.json(tarifas);
  } catch (err) {
    next(err);
  }
};

exports.obtenerTarifa = async (req, res, next) => {
  try {
    console.log("Datos tarifa con ID:", req.params.tariffId, "para cancha ID:", req.params.canchaId);
    const tarifa = await tarifaService.getTarifaById(req.params.canchaId, req.params.tariffId);
    res.json(tarifa);
  } catch (err) {
    next(err);
  }
};

exports.crearTarifa = async (req, res, next) => {
  try {
    const nueva = await tarifaService.createTarifa(req.body, req.params.canchaId);
    res.status(201).json(nueva);
  } catch (err) {
    next(err);
  }
};

exports.actualizarTarifa = async (req, res, next) => {
  try {
    console.log("Actualizando tarifa con ID:", req.params.tariffId, "para cancha ID:", req.params.canchaId);
    const updated = await tarifaService.updateTarifaById(req.params.canchaId, req.params.tariffId, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.eliminarTarifa = async (req, res, next) => {
  try {
    await tarifaService.deleteTarifaById(req.params.canchaId, req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
