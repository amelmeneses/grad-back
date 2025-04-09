const express = require("express");
const router = express.Router();
const db = require("../database_updated");

// Obtener todas las reservas
router.get("/", (req, res) => {
  db.all("SELECT * FROM reservations", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Obtener reservas por usuario
router.get("/user/:userId", (req, res) => {
  db.all("SELECT * FROM reservations WHERE user_id = ?", [req.params.userId], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Crear nueva reserva
router.post("/", (req, res) => {
  const { user_id, court_id, date, start_time, end_time, status } = req.body;
  db.run(
    "INSERT INTO reservations (user_id, court_id, date, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?)",
    [user_id, court_id, date, start_time, end_time, status],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID });
    }
  );
});

// Actualizar reserva
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { user_id, court_id, date, start_time, end_time, status } = req.body;
  db.run(
    "UPDATE reservations SET user_id = ?, court_id = ?, date = ?, start_time = ?, end_time = ?, status = ? WHERE id = ?",
    [user_id, court_id, date, start_time, end_time, status, id],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ updated: this.changes });
    }
  );
});

// Eliminar reserva
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM reservations WHERE id = ?", req.params.id, function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ deleted: this.changes });
  });
});

module.exports = router;
