const express = require('express');
const { registrarUsuario } = require('../controllers/userController');

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', registrarUsuario);

// Listar todos los usuarios
//router.get('/users', listarUsuarios);

module.exports = router;
