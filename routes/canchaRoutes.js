// routes/canchaRoutes.js
const express = require('express');
const router = express.Router();
const {
  listarCanchas,
  obtenerCancha,
  crearCancha,
  actualizarCancha,
  eliminarCancha,
  desactivarCancha,   // <-- importamos los nuevos
  activarCancha,
  canchasPorDeporte 
} = require('../controllers/canchaController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Nuevo endpoint para usuarios
router.get('/canchas/por-deporte', authMiddleware, (req, res, next) => {
  if (req.user.role !== 2) {
    return res.status(403).json({ message: 'Acceso restringido a usuarios.' });
  }
  return canchasPorDeporte(req, res, next);
});


router.get('/canchas',             authMiddleware, isAdmin, listarCanchas);
router.get('/canchas/:id',         authMiddleware, isAdmin, obtenerCancha);
router.post('/canchas',            authMiddleware, isAdmin, crearCancha);
router.put('/canchas/:id',         authMiddleware, isAdmin, actualizarCancha);
router.delete('/canchas/:id',      authMiddleware, isAdmin, eliminarCancha);

// Nuevos endpoints para activar / desactivar
router.patch('/canchas/:id/desactivar', authMiddleware, isAdmin, desactivarCancha);
router.patch('/canchas/:id/activar',    authMiddleware, isAdmin, activarCancha);


// Nueva ruta para obtener detalles de cancha para usuarios clientes
router.get('/reservas-cancha/:id', authMiddleware, (req, res, next) => {
  if (req.user.role !== 2) {
    return res.status(403).json({ message: 'Acceso restringido a usuarios.' });
  }
  return require('../controllers/canchaController').obtenerCanchaParaReserva(req, res, next);
});

module.exports = router;
