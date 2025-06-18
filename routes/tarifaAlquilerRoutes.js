// backend/routes/tarifaAlquilerRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  listarTarifas,
  obtenerTarifa,
  crearTarifa,
  actualizarTarifa,
  eliminarTarifa
} = require('../controllers/tarifaAlquilerController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Todas las rutas bajo /api/canchas/:canchaId/tarifas
router.get(
  '/canchas/:canchaId/tarifas',
  authMiddleware,
  isAdmin,
  listarTarifas
);
router.get(
  '/canchas/:canchaId/tarifas/:tariffId',
  authMiddleware,
  isAdmin,
  obtenerTarifa
);
router.post(
  '/canchas/:canchaId/tarifas',
  authMiddleware,
  isAdmin,
  crearTarifa
);
router.put(
  '/canchas/:canchaId/tarifas/:tariffId',
  authMiddleware,
  isAdmin,
  actualizarTarifa
);
router.delete(
  '/canchas/:canchaId/tarifas/:id',
  authMiddleware,
  isAdmin,
  eliminarTarifa
);

module.exports = router;
