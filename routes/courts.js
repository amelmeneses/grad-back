const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/", (req, res) => {
  db.all("SELECT * FROM courts", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Obtener canchas por empresa
router.get("/company/:companyId", (req, res) => {
  db.all("SELECT * FROM courts WHERE company_id = ?", [req.params.companyId], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

router.post("/", (req, res) => {
  const { name, description, price_per_hour, sport_type, location, company_id } = req.body;
  db.run(
    "INSERT INTO courts (name, description, price_per_hour, sport_type, location, company_id) VALUES (?, ?, ?, ?, ?, ?)",
    [name, description, price_per_hour, sport_type, location, company_id],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID });
    }
  );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, price_per_hour, sport_type, location, company_id } = req.body;
  db.run(
    "UPDATE courts SET name = ?, description = ?, price_per_hour = ?, sport_type = ?, location = ?, company_id = ? WHERE id = ?",
    [name, description, price_per_hour, sport_type, location, company_id, id],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ updated: this.changes });
    }
  );
});

router.delete("/:id", (req, res) => {
  db.run("DELETE FROM courts WHERE id = ?", req.params.id, function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ deleted: this.changes });
  });
});

module.exports = router;
