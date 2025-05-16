// backend/routes/userRoutes.js
const express = require('express');
const { registrarUsuario, listarUsuarios } = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registrarUsuario);
router.get('/users', authMiddleware, isAdmin, listarUsuarios);

module.exports = router;
