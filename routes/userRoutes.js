// backend/routes/userRoutes.js

const express = require('express');
const {
  registrarUsuario,
  registerAnonUser,
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  desactivarUsuario,
  activarUsuario,
  getOwnProfile,
  updateOwnProfile
} = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { getUsuarioById } = require('../services/userService');
const router = express.Router();

// Obtener los datos del propio usuario
router.get('/me', authMiddleware, getOwnProfile);

// Actualizar el propio usuario
router.put('/me', authMiddleware, updateOwnProfile);

// Registrar (público)
router.post('/register', registrarUsuario);

// Registrar anónimo (público)
router.post('/register-anon-user', registerAnonUser);

// Listar todos (sólo admin)
router.get('/users', authMiddleware, isAdmin, listarUsuarios);

// Obtener uno (sólo admin)
router.get('/users/:id', authMiddleware, isAdmin, obtenerUsuario);

 // Actualizar usuario (admin or same user)
router.put(
  '/users/:id',
  authMiddleware,
  (req, res, next) => {
    // if admin OR same user
    if (req.user.role === 1 || Number(req.params.id) === req.user.id) {
      return next();
    }
    res.status(403).json({ message: 'No autorizado' });
  },
  actualizarUsuario
);

// Desactivar / Activar (sólo admin)
router.patch('/users/:id/desactivar', authMiddleware, isAdmin, desactivarUsuario);
router.patch('/users/:id/activar',   authMiddleware, isAdmin, activarUsuario);

// Eliminar (sólo admin)
router.delete('/users/delete/:id', authMiddleware, isAdmin, eliminarUsuario);

module.exports = router;
