// backend/services/empresaService.js

const { Empresa } = require('../models/empresaModel');
const Cancha = require('../models/canchaModel');

exports.getAllEmpresas = async () => {
  return await Empresa.findAll({
    include: [{
      model: Cancha,
      as: 'courts',
      attributes: ['id', 'deporte']
    }]
  });
};

exports.getEmpresasByUsuario = async (usuario_id) => {
  return await Empresa.findAll({
    where: { usuario_id },
    include: [{
      model: Cancha,
      as: 'courts',
      attributes: ['id', 'deporte']
    }]
  });
};

exports.getEmpresaById = async (id) => {
  const empresa = await Empresa.findByPk(id, {
    include: [{
      model: Cancha,
      as: 'courts',
      attributes: ['id', 'deporte']
    }]
  });
  if (!empresa) {
    const err = new Error('Empresa no encontrada');
    err.status = 404;
    throw err;
  }
  return empresa;
};

exports.createEmpresa = async (data) => {
  return await Empresa.create(data);
};

exports.updateEmpresaById = async (id, data) => {
  const empresa = await Empresa.findByPk(id);
  if (!empresa) {
    const err = new Error('Empresa no encontrada');
    err.status = 404;
    throw err;
  }
  return await empresa.update(data);
};

exports.deleteEmpresaById = async (id) => {
  const empresa = await Empresa.findByPk(id);
  if (!empresa) {
    const err = new Error('Empresa no encontrada');
    err.status = 404;
    throw err;
  }
  await empresa.destroy();
};
