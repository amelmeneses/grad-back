// backend/controllers/facturacionController.js

const facturacionService = require('../services/facturacionService');

exports.listarFacturas = async (req, res, next) => {
  try {
    // Si viene query ?usuario_id=, filtramos por usuario
    if (req.query.usuario_id) {
      const facturas = await facturacionService.getFacturasByUsuario(req.query.usuario_id);
      return res.json(facturas);
    }
    // Si no, devolvemos todas
    const facturas = await facturacionService.getAllFacturas();
    res.json(facturas);
  } catch (err) {
    next(err);
  }
};

exports.crearFactura = async (req, res, next) => {
  try {
    const nueva = await facturacionService.createFactura(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    next(err);
  }
};

exports.actualizarFactura = async (req, res, next) => {
  try {
    const updated = await facturacionService.updateFacturaById(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.eliminarFactura = async (req, res, next) => {
  try {
    await facturacionService.deleteFacturaById(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
