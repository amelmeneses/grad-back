// backend/routes/empresaRoutes.js
const express = require('express');
const {
  listarEmpresas,
  obtenerEmpresa,
  crearEmpresa,
  actualizarEmpresa,
  eliminarEmpresa
} = require('../controllers/empresaController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/empresas — todos o con filtro ?usuario_id=
// (sólo admin)
router.get('/empresas', authMiddleware, isAdmin, listarEmpresas);

// GET /api/empresas/:id — un sólo registro
router.get('/empresas/:id', authMiddleware, isAdmin, obtenerEmpresa);

// POST /api/empresas — crear
router.post('/empresas', authMiddleware, isAdmin, crearEmpresa);

// PUT /api/empresas/:id — actualizar
router.put('/empresas/:id', authMiddleware, isAdmin, actualizarEmpresa);

// DELETE /api/empresas/:id — borrar
router.delete('/empresas/:id', authMiddleware, isAdmin, eliminarEmpresa);

module.exports = router;
