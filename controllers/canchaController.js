// backend/controllers/canchaController.js
const canchaService = require('../services/canchaService');

exports.listarCanchas = async (req, res, next) => {
  try {
    const { empresa_id } = req.query;
    const canchas = empresa_id
      ? await canchaService.getByEmpresa(empresa_id)
      : await canchaService.getAll();
    res.json(canchas);
  } catch (err) {
    next(err);
  }
};

exports.obtenerCancha = async (req, res, next) => {
  try {
    const cancha = await canchaService.getById(req.params.id);
    res.json(cancha);
  } catch (err) {
    next(err);
  }
};

exports.crearCancha = async (req, res, next) => {
  try {
    const nueva = await canchaService.create(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    next(err);
  }
};

exports.actualizarCancha = async (req, res, next) => {
  try {
    const updated = await canchaService.updateById(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.eliminarCancha = async (req, res, next) => {
  try {
    await canchaService.deleteById(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
