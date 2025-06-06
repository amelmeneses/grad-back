// backend/routes/facturacionRoutes.js

const express = require("express");
const {
  listarFacturas,
  crearFactura,
  actualizarFactura,
  eliminarFactura,
} = require("../controllers/facturacionController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * Rutas para “facturacion” (datos de facturación):
 * GET    /api/facturacion?usuario_id=123   → listar facturas para usuario 123
 * GET    /api/facturacion                  → listar todas las facturas
 * POST   /api/facturacion                  → crear nueva factura
 * PUT    /api/facturacion/:id              → actualizar factura
 * DELETE /api/facturacion/:id              → eliminar factura
 *
 * Todas requieren token válido + rol admin.
 */
router.get("/facturacion", authMiddleware, isAdmin, listarFacturas);
router.post("/facturacion", authMiddleware, isAdmin, crearFactura);
router.put("/facturacion/:id", authMiddleware, isAdmin, actualizarFactura);
router.delete("/facturacion/:id", authMiddleware, isAdmin, eliminarFactura);

module.exports = router;
