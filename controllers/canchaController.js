// backend/controllers/canchaController.js
const canchaService = require('../services/canchaService');

exports.listarCanchas = async (req, res, next) => {
  try {
    // Aceptamos company_id (_case_) o empresa_id (spanish) o companyId (camel)
    const rawId = req.query.company_id ?? req.query.empresa_id ?? req.query.companyId;
    const empresaId = rawId ? Number(rawId) : null;

    const canchas = empresaId
      ? await canchaService.getByEmpresa(empresaId)
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
    // Destructuramos los campos que realmente llegan desde el frontend
    const {
      nombre,
      descripcion,
      ubicacion,
      deporte,
      empresa_id,
      companyId  // opcional, por compatibilidad
    } = req.body;

    const nueva = await canchaService.create({
      nombre:       nombre,
      descripcion:  descripcion,
      ubicacion:    ubicacion,
      deporte:      deporte,
      empresa_id:   empresa_id ?? companyId
    });

    res.status(201).json(nueva);
  } catch (err) {
    next(err);
  }
};

exports.actualizarCancha = async (req, res, next) => {
  try {
    const {
      nombre,
      descripcion,
      ubicacion,
      deporte,
      empresa_id,
      companyId
    } = req.body;

    const updated = await canchaService.updateById(req.params.id, {
      nombre:       nombre,
      descripcion:  descripcion,
      ubicacion:    ubicacion,
      deporte:      deporte,
      empresa_id:   empresa_id ?? companyId
    });

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
