// backend/controllers/empresaController.js
const empresaService = require('../services/empresaService');

exports.listarEmpresas = async (req, res, next) => {
  try {
    if (req.query.usuario_id) {
      const empresas = await empresaService.getEmpresasByUsuario(req.query.usuario_id);
      return res.json(empresas);
    }
    const empresas = await empresaService.getAllEmpresas();
    res.json(empresas);
  } catch (err) {
    next(err);
  }
};

exports.obtenerEmpresa = async (req, res, next) => {
  try {
    const empresa = await empresaService.getEmpresaById(req.params.id);
    res.json(empresa);
  } catch (err) {
    next(err);
  }
};

exports.crearEmpresa = async (req, res, next) => {
  try {
    const nueva = await empresaService.createEmpresa(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    next(err);
  }
};

exports.actualizarEmpresa = async (req, res, next) => {
  try {
    const updated = await empresaService.updateEmpresaById(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.eliminarEmpresa = async (req, res, next) => {
  try {
    await empresaService.deleteEmpresaById(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
