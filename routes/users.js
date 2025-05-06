const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

router.post("/", (req, res) => {
  const { first_name, last_name, email, password, birth_date, role } = req.body;
  db.run(
    "INSERT INTO users (first_name, last_name, email, password, birth_date, role) VALUES (?, ?, ?, ?, ?, ?)",
    [first_name, last_name, email, password, birth_date, role],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID });
    }
  );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, password, birth_date, role } = req.body;
  db.run(
    "UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ?, birth_date = ?, role = ? WHERE id = ?",
    [first_name, last_name, email, password, birth_date, role, id],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ updated: this.changes });
    }
  );
});

router.delete("/:id", (req, res) => {
  db.run("DELETE FROM users WHERE id = ?", req.params.id, function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ deleted: this.changes });
  });
});

module.exports = router;
