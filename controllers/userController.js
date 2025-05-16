// backend/controllers/userController.js
const {
  registrarNuevoUsuario,
  getAllUsuarios    // <-- lo importamos aquí
} = require('../services/userService');

exports.registrarUsuario = async (req, res) => {
  /* ... tu código de registro ... */
};

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
