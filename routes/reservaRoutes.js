// routes/reservaRoutes.js
const express = require('express');
const router  = express.Router();
const {
  crear,
  misReservas,
  listarReservas,
  cancelar
} = require('../controllers/reservaController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Crear reserva (usuarios)
router.post('/reservas', authMiddleware, crear);

// Listar reservas de usuario
router.get('/mis-reservas', authMiddleware, misReservas);

// Listar reservas (admin & empresa)
router.get('/reservas', authMiddleware, listarReservas);

// Cancelar reserva
router.patch('/reservas/:id/cancel', authMiddleware, cancelar);

module.exports = router;
