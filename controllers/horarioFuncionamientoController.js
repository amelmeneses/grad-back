// backend/controllers/horarioFuncionamientoController.js
const service = require('../services/horarioFuncionamientoService');

exports.listarHorarios = async (req, res, next) => {
  try {
    const list = await service.getAllHorarios(req.params.canchaId);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.obtenerHorario = async (req, res, next) => {
  try {
    const h = await service.getHorarioById(req.params.canchaId, req.params.id);
    res.json(h);
  } catch (err) {
    next(err);
  }
};

exports.crearHorario = async (req, res, next) => {
  try {
    const nuevo = await service.createHorario(req.body, req.params.canchaId);
    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
};

exports.actualizarHorario = async (req, res, next) => {
  try {
    const updated = await service.updateHorarioById(
      req.params.canchaId,
      req.params.id,
      req.body
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.eliminarHorario = async (req, res, next) => {
  try {
    await service.deleteHorarioById(req.params.canchaId, req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
