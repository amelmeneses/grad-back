const { registrarNuevoUsuario } = require('../services/userService');

exports.registrarUsuario = async (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  try {
    const nuevoUsuario = await registrarNuevoUsuario({ nombre, apellido, email, password });
    res.status(201).json({ message: 'Usuario creado exitosamente', user: nuevoUsuario });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
