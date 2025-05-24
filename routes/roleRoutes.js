// backend/routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const { listarRoles } = require('../controllers/roleController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// GET /api/roles — sólo admins
router.get('/roles', authMiddleware, isAdmin, listarRoles);

module.exports = router;
