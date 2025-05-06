const express = require('express');
const { registrarUsuario } = require('../controllers/userController');

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', registrarUsuario);

module.exports = router;
