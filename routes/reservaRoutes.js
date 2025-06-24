// routes/reservaRoutes.js
const express = require('express');
const router = express.Router();
const { crear, misReservas } = require('../controllers/reservaController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/reservas', authMiddleware, crear);
router.get('/mis-reservas', authMiddleware, misReservas);

module.exports = router;
