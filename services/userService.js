const bcrypt = require('bcrypt');
const { Usuario } = require('../models/userModel');  // Importamos el modelo de usuario

// Función para registrar un nuevo usuario
exports.registrarNuevoUsuario = async ({ nombre, apellido, email, password, rol_id = 3 }) => {
  // Verificar si el correo ya está registrado
  const usuarioExistente = await Usuario.findOne({ where: { email } });
  if (usuarioExistente) {
    throw new Error('El correo electrónico ya está registrado.');
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear el nuevo usuario con rol por defecto (Usuario = 3)
  const nuevoUsuario = await Usuario.create({
    nombre,
    apellido,
    email,
    contrasena: hashedPassword,
    rol_id,
  });

  return nuevoUsuario;
};
