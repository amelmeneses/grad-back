const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/", (req, res) => {
  db.all("SELECT * FROM companies", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

router.post("/", (req, res) => {
  const { name, email, phone, location } = req.body;
  db.run(
    "INSERT INTO companies (name, email, phone, location) VALUES (?, ?, ?, ?)",
    [name, email, phone, location],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID });
    }
  );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, phone, location } = req.body;
  db.run(
    "UPDATE companies SET name = ?, email = ?, phone = ?, location = ? WHERE id = ?",
    [name, email, phone, location, id],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ updated: this.changes });
    }
  );
});

router.delete("/:id", (req, res) => {
  db.run("DELETE FROM companies WHERE id = ?", req.params.id, function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ deleted: this.changes });
  });
});

module.exports = router;
