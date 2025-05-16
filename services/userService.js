// backend/services/userService.js
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models/userModel');
const { Role }    = require('../models/roleModel');

// Función para registrar un nuevo usuario (ya existente)
exports.registrarNuevoUsuario = async ({ nombre, apellido, email, password, rol_id = 3 }) => {
  const usuarioExistente = await Usuario.findOne({ where: { email } });
  if (usuarioExistente) {
    throw new Error('El correo electrónico ya está registrado.');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  return await Usuario.create({ nombre, apellido, email, contrasena: hashedPassword, rol_id });
};

// **NUEVO**: función para obtener todos los usuarios con su rol
exports.getAllUsuarios = async () => {
  return await Usuario.findAll({
    attributes: ['id','nombre','apellido','email','fecha_creacion'],
    include: [{
      model: Role,
      as: 'Role',
      attributes: ['nombre']
    }]
  });
};
