// backend/routes/userRoutes.js

const express = require('express');
const {
  registrarUsuario,
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  desactivarUsuario,
  activarUsuario
} = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Registrar (público)
router.post('/register', registrarUsuario);

// Listar todos (sólo admin)
router.get('/users', authMiddleware, isAdmin, listarUsuarios);

// Obtener uno (sólo admin)
router.get('/users/:id', authMiddleware, isAdmin, obtenerUsuario);

// Actualizar (sólo admin)
router.put('/users/:id', authMiddleware, isAdmin, actualizarUsuario);

// Desactivar / Activar (sólo admin)
router.patch('/users/:id/desactivar', authMiddleware, isAdmin, desactivarUsuario);
router.patch('/users/:id/activar',   authMiddleware, isAdmin, activarUsuario);

// Eliminar (sólo admin)
router.delete('/users/delete/:id', authMiddleware, isAdmin, eliminarUsuario);

module.exports = router;
