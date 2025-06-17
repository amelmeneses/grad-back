// backend/routes/tarifaAlquilerRoutes.js
const express = require('express');
const router = express.Router();
const {
  listarTarifas,
  obtenerTarifa,
  crearTarifa,
  actualizarTarifa,
  eliminarTarifa
} = require('../controllers/tarifaAlquilerController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Listar todas o filtrar por cancha_id
router.get('/tarifas', authMiddleware, isAdmin, listarTarifas);
// Obtener una
router.get('/tarifas/:id', authMiddleware, isAdmin, obtenerTarifa);
// Crear
router.post('/tarifas', authMiddleware, isAdmin, crearTarifa);
// Actualizar
router.put('/tarifas/:id', authMiddleware, isAdmin, actualizarTarifa);
// Eliminar
router.delete('/tarifas/:id', authMiddleware, isAdmin, eliminarTarifa);

module.exports = router;
