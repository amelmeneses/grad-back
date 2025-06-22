// backend/services/authService.js
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { Usuario } = require('../models/userModel');
const { Role }    = require('../models/roleModel');

exports.loginUsuario = async (email, password) => {
  const usuario = await Usuario.findOne({
    where: { email },
    include: [{ model: Role, as: 'Role' }],
  });
  if (!usuario) throw new Error('Correo o contraseña inválidos');
  const match = await bcrypt.compare(password, usuario.contrasena);
  if (!match) throw new Error('Correo o contraseña inválidos');
  console.log(`Usuario ${usuario.nombre} ${usuario.apellido} ha iniciado sesión`);
  // include `name` in the token
  const token = jwt.sign(
    {
      id: usuario.id,
      role: usuario.rol_id,
      name: `${usuario.nombre}`,
    },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
  return token;
};
