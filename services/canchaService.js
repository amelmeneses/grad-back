// backend/services/canchaService.js
const Cancha = require('../models/canchaModel');

exports.getAll = () =>
  Cancha.findAll();

exports.getByEmpresa = (empresaId) =>
  Cancha.findAll({ where: { empresa_id: empresaId } });

exports.getById = (id) =>
  Cancha.findByPk(id);

exports.create = (data) =>
  Cancha.create(data);

exports.updateById = (id, data) =>
  Cancha.update(
    data,
    { where: { id }, returning: true }
  ).then(([_, rows]) => rows[0]);

exports.deleteById = (id) =>
  Cancha.destroy({ where: { id } });
