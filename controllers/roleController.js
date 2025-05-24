// backend/controllers/roleController.js
const roleService = require('../services/roleService');

exports.listarRoles = async (req, res, next) => {
  try {
    const roles = await roleService.getAllRoles();
    res.json(roles);
  } catch (err) {
    next(err);
  }
};
