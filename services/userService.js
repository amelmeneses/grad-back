// backend/services/userService.js

const bcrypt = require('bcryptjs');
const { Usuario } = require('../models/userModel');
const { Role }    = require('../models/roleModel');
const { Empresa } = require('../models/empresaModel');
// const { sendMail } = require('../utils/mailer');
const { v4: uuidv4 } = require('uuid');

// Función para registrar un nuevo usuario
exports.registrarNuevoUsuario = async ({ nombre, apellido, email, password, rol_id = 3, estado }) => {
  const usuarioExistente = await Usuario.findOne({ where: { email } });
  if (usuarioExistente) {
    throw new Error('El correo electrónico ya está registrado.');
  }
  // const hashedPassword = await bcrypt.hash(password, 10);
  return await Usuario.create({
    nombre,
    apellido,
    email,
    contrasena: password,
    rol_id,
    estado,
  });
};

/**
 * Crea un usuario anónimo (o empresa) con estado = 0 e
 * opcionalmente crea su empresa asociada.
 *
 * @param {object} opts
 * @param {string} opts.nombre
 * @param {string} opts.apellido
 * @param {string} opts.email
 * @param {string} opts.password
 * @param {number} [opts.rol_id]    // si viene, lo usamos; si no, 2 = usuario
 * @param {object} [opts.empresa]   // si viene, objeto con { nombre, contacto_email, contacto_telefono, direccion }
 */
exports.registrarNuevoUsuarioAnonimo = async ({
  nombre,
  apellido,
  email,
  password,
  rol_id,
  empresa
}) => {
  const exists = await Usuario.findOne({ where: { email } });
  if (exists) {
    const err = new Error('El correo electrónico ya está registrado.');
    err.status = 400;
    throw err;
  }

  const activationToken = uuidv4();
  const user = await Usuario.create({
    nombre,
    apellido,
    email,
    contrasena: password,
    rol_id: rol_id ?? 2,     // default to 2 (“usuario”) but we'll override in controller if needed
    estado: 0,               // inactivo hasta activar
    activation_token: activationToken,
  });

  // If the frontend passed an `empresa` object, create it now.
  if (empresa) {
    await Empresa.create({
      ...empresa,
      usuario_id: user.id
    });
  }

  return user;
};

exports.activateUserByToken = async (token) => {
  const user = await Usuario.findOne({ where: { activation_token: token } });
  if (!user) {
    const err = new Error('Token de activación inválido o expirado.');
    err.status = 404;
    throw err;
  }
  user.estado = 1;                   // activo
  user.activation_token = null;      // ya no vale
  await user.save();
  return user;
};

// Obtener todos los usuarios con su rol (sin incluir contrasena)
exports.getAllUsuarios = async () => {
  return await Usuario.findAll({
    attributes: ['id', 'nombre', 'apellido', 'email', 'estado', 'fecha_creacion', 'rol_id'],
    include: [{
      model: Role,
      as: 'Role',
      attributes: ['nombre']
    }]
  });
};

// Obtener un usuario por su ID (con rol)
exports.getUsuarioById = async (id) => {
  const usuario = await Usuario.findByPk(id, {
    attributes: ['id', 'nombre', 'apellido', 'email', 'estado', 'fecha_creacion', 'rol_id'],
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

// Actualizar un usuario por su ID
exports.updateUsuarioById = async (id, { nombre, apellido, email, contrasena, rol_id, estado }) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }

  if (contrasena) {
    // usuario.contrasena = await bcrypt.hash(contrasena, 10);
    usuario.contrasena = contrasena; // Asignamos directamente la contraseña sin hashear
  }

  usuario.nombre   = nombre;
  usuario.apellido = apellido;
  usuario.email    = email;
  usuario.rol_id   = rol_id;
  usuario.estado   = typeof estado !== 'undefined' ? estado : usuario.estado;

  await usuario.save();
  return usuario;
};

// Eliminar un usuario (previo chequeo de empresas)
exports.deleteUsuarioById = async (id) => {
  const empresas = await Empresa.findAll({ where: { usuario_id: id } });
  if (empresas.length > 0) {
    const err = new Error('El usuario tiene una empresa asociada. Elimínala primero.');
    err.status = 400;
    throw err;
  }

  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }

  await usuario.destroy();
};

// ** NUEVO **: Cambiar sólo el estado (activar / desactivar)
exports.cambiarEstadoUsuario = async (id, nuevoEstado) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  usuario.estado = nuevoEstado;
  await usuario.save();
  return usuario;
};