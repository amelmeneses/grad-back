// backend/controllers/userController.js

const {
  registrarNuevoUsuario,
  getAllUsuarios,
  getUsuarioById,
  updateUsuarioById,
  deleteUsuarioById
} = require('../services/userService');

exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol_id } = req.body;
    const user = await registrarNuevoUsuario({ nombre, apellido, email, password, rol_id });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un solo usuario por ID
exports.obtenerUsuario = async (req, res) => {
  try {
    const usuario = await getUsuarioById(req.params.id);
    res.json(usuario);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// Actualizar un usuario por ID (incluye estado)
exports.actualizarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, contrasena, rol_id, estado } = req.body;
    const usuario = await updateUsuarioById(
      req.params.id,
      { nombre, apellido, email, contrasena, rol_id, estado }
    );
    res.json(usuario);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// Eliminar un usuario
exports.eliminarUsuario = async (req, res, next) => {
  try {
    await deleteUsuarioById(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
