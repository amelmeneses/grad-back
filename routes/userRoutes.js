// backend/routes/userRoutes.js
const express = require('express');
const {
  registrarUsuario,
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario
} = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Registrar (público)
router.post('/register', registrarUsuario);

// Listar todos (sólo admin)
router.get('/users', authMiddleware, isAdmin, listarUsuarios);

// Obtener uno por ID (sólo admin)
router.get('/users/:id', authMiddleware, isAdmin, obtenerUsuario);

// Actualizar por ID (sólo admin)
router.put('/users/:id', authMiddleware, isAdmin, actualizarUsuario);

module.exports = router;
