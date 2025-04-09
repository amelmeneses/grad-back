const express = require("express");
const router = express.Router();
const db = require("../database_updated");

// Obtener todos los servicios
router.get("/", (req, res) => {
  db.all("SELECT * FROM services", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Obtener servicios por cancha
router.get("/court/:courtId", (req, res) => {
  db.all("SELECT * FROM services WHERE court_id = ?", [req.params.courtId], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Crear nuevo servicio
router.post("/", (req, res) => {
  const { name, description, price, court_id } = req.body;
  db.run(
    "INSERT INTO services (name, description, price, court_id) VALUES (?, ?, ?, ?)",
    [name, description, price, court_id],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID });
    }
  );
});

// Actualizar servicio
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, price, court_id } = req.body;
  db.run(
    "UPDATE services SET name = ?, description = ?, price = ?, court_id = ? WHERE id = ?",
    [name, description, price, court_id, id],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ updated: this.changes });
    }
  );
});

// Eliminar servicio
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM services WHERE id = ?", req.params.id, function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ deleted: this.changes });
  });
});

module.exports = router;
