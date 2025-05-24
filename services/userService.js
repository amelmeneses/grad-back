// backend/services/userService.js

const bcrypt = require('bcryptjs');
const { Usuario } = require('../models/userModel');
const { Role }    = require('../models/roleModel');
const { Empresa } = require('../models/empresaModel');

// Función para registrar un nuevo usuario
exports.registrarNuevoUsuario = async ({ nombre, apellido, email, password, rol_id = 3 }) => {
  const usuarioExistente = await Usuario.findOne({ where: { email } });
  if (usuarioExistente) {
    throw new Error('El correo electrónico ya está registrado.');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  return await Usuario.create({
    nombre,
    apellido,
    email,
    contrasena: hashedPassword,
    rol_id
  });
};

// Obtener todos los usuarios con su rol
exports.getAllUsuarios = async () => {
  return await Usuario.findAll({
    attributes: ['id', 'nombre', 'apellido', 'email', 'fecha_creacion'],
    include: [{
      model: Role,
      as: 'Role',
      attributes: ['nombre']
    }]
  });
};

// ** NUEVO **: Obtener un usuario por su ID (con rol)
exports.getUsuarioById = async (id) => {
  const usuario = await Usuario.findByPk(id, {
    attributes: ['id', 'nombre', 'apellido', 'email', 'fecha_creacion', 'rol_id'],
    include: [{
      model: Role,
      as: 'Role',
      attributes: ['id', 'nombre']
    }]
  });
  if (!usuario) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  return usuario;
};

// ** NUEVO **: Actualizar un usuario por su ID
exports.updateUsuarioById = async (id, { nombre, apellido, email, contrasena, rol_id }) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }

  // Si nos llega una contraseña nueva, la hasheamos
  if (contrasena) {
    usuario.contrasena = await bcrypt.hash(contrasena, 10);
  }

  // Actualizamos el resto de campos
  usuario.nombre   = nombre;
  usuario.apellido = apellido;
  usuario.email    = email;
  usuario.rol_id   = rol_id;

  await usuario.save();
  return usuario;
};

/**
 * Elimina un usuario, pero primero comprueba si tiene empresas asociadas.
 * Si existen, lanza un error para pedir eliminar la empresa primero.
 */
exports.deleteUsuarioById = async (id) => {
  // 1) ¿Tiene empresas?
  const empresas = await Empresa.findAll({ where: { usuario_id: id } });
  if (empresas.length > 0) {
    const err = new Error('El usuario tiene una empresa asociada. Elimínala primero.');
    err.status = 400;
    throw err;
  }

  // 2) Buscar usuario
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }

  // 3) Borrar
  await usuario.destroy();
};