// backend/services/roleService.js
const { Role } = require('../models/roleModel');

exports.getAllRoles = async () => {
  // Sólo devolvemos id y nombre
  return await Role.findAll({
    attributes: ['id', 'nombre']
  });
};
