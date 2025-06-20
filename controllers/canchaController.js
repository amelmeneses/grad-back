// controllers/canchaController.js
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
    // Destructuramos los campos que llegan desde el frontend
    const {
      nombre,
      descripcion,
      ubicacion,
      deporte,
      estado,       // <-- nuevo campo
      empresa_id,
      companyId     // opcional, por compatibilidad
    } = req.body;

    const nueva = await canchaService.create({
      nombre,
      descripcion,
      ubicacion,
      deporte,
      estado: estado ?? 0,
      empresa_id: empresa_id ?? companyId
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
      estado,       // <-- nuevo campo
      empresa_id,
      companyId
    } = req.body;

    const updated = await canchaService.updateById(req.params.id, {
      nombre,
      descripcion,
      ubicacion,
      deporte,
      estado: estado ?? 0,
      empresa_id: empresa_id ?? companyId
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

exports.desactivarCancha = async (req, res, next) => {
  try {
    await canchaService.cambiarEstadoCancha(req.params.id, 0);
    res.json({ message: 'Cancha desactivada.' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// PATCH /canchas/:id/activar
exports.activarCancha = async (req, res, next) => {
  try {
    await canchaService.cambiarEstadoCancha(req.params.id, 1);
    res.json({ message: 'Cancha activada.' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};
