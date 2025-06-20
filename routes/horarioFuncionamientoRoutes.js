// backend/routes/horarioFuncionamientoRoutes.js
const express = require('express');
const router  = express.Router({ mergeParams: true });
const {
  listarHorarios,
  obtenerHorario,
  crearHorario,
  actualizarHorario,
  eliminarHorario,
} = require('../controllers/horarioFuncionamientoController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// All under /api/canchas/:canchaId/horarios
router.get(
  '/canchas/:canchaId/horarios',
  authMiddleware,
  isAdmin,
  listarHorarios
);
router.get(
  '/canchas/:canchaId/horarios/:id',
  authMiddleware,
  isAdmin,
  obtenerHorario
);
router.post(
  '/canchas/:canchaId/horarios',
  authMiddleware,
  isAdmin,
  crearHorario
);
router.put(
  '/canchas/:canchaId/horarios/:id',
  authMiddleware,
  isAdmin,
  actualizarHorario
);
router.delete(
  '/canchas/:canchaId/horarios/:id',
  authMiddleware,
  isAdmin,
  eliminarHorario
);

module.exports = router;
