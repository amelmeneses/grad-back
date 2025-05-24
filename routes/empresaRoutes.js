// backend/routes/empresaRoutes.js
const express = require('express');
const router = express.Router();
const {
  listarEmpresas,
  crearEmpresa,
  actualizarEmpresa,
  eliminarEmpresa
} = require('../controllers/empresaController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Todas estas rutas requieren token + rol admin
router.get('/empresas', authMiddleware, isAdmin, listarEmpresas);
router.post('/empresas', authMiddleware, isAdmin, crearEmpresa);
router.put('/empresas/:id', authMiddleware, isAdmin, actualizarEmpresa);
router.delete('/empresas/:id', authMiddleware, isAdmin, eliminarEmpresa);

module.exports = router;
