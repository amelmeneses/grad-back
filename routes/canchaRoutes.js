const express = require('express');
const router = express.Router();
const {
  listarCanchas,
  obtenerCancha,
  crearCancha,
  actualizarCancha,
  eliminarCancha,
  desactivarCancha,   // <-- importamos los nuevos
  activarCancha
} = require('../controllers/canchaController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.get('/canchas',             authMiddleware, isAdmin, listarCanchas);
router.get('/canchas/:id',         authMiddleware, isAdmin, obtenerCancha);
router.post('/canchas',            authMiddleware, isAdmin, crearCancha);
router.put('/canchas/:id',         authMiddleware, isAdmin, actualizarCancha);
router.delete('/canchas/:id',      authMiddleware, isAdmin, eliminarCancha);

// Nuevos endpoints para activar / desactivar
router.patch('/canchas/:id/desactivar', authMiddleware, isAdmin, desactivarCancha);
router.patch('/canchas/:id/activar',    authMiddleware, isAdmin, activarCancha);

module.exports = router;
