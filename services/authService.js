const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/userModel');  // Importamos el modelo de usuario

// Función para autenticar al usuario
exports.loginUsuario = async (email, password) => {
  const usuario = await Usuario.findOne({ where: { email }, include: ['Rol'] });

  if (!usuario) {
    throw new Error('Correo o contraseña inválidos');
  }

  const match = await bcrypt.compare(password, usuario.contrasena);
  if (!match) {
    throw new Error('Correo o contraseña inválidos');
  }

  // Generar el token JWT incluyendo el rol del usuario
  const token = jwt.sign(
    { id: usuario.id, role: usuario.rol_id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};
