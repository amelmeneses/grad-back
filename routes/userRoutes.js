// backend/routes/userRoutes.js

const express = require('express');
const {
  registrarUsuario,
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Registrar (público) — POST /api/register
router.post('/register', registrarUsuario);

// Listar todos los usuarios (sólo admin) — GET /api/users
router.get('/users', authMiddleware, isAdmin, listarUsuarios);

// Obtener uno por ID (sólo admin) — GET /api/users/:id
router.get('/users/:id', authMiddleware, isAdmin, obtenerUsuario);

// Actualizar por ID (sólo admin) — PUT /api/users/:id
router.put('/users/:id', authMiddleware, isAdmin, actualizarUsuario);

// Eliminar un usuario (sólo admin) — DELETE /api/users/delete/:id
router.delete('/users/delete/:id', authMiddleware, isAdmin, eliminarUsuario);

module.exports = router;
