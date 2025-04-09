const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database_updated"); // Archivo actualizado

const app = express();

app.use(cors());
app.use(bodyParser.json()); // Middleware to parse JSON body
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded data

// API Endpoints for Users
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post("/users", (req, res) => {
  const { first_name, last_name, email, password, birth_date, role } = req.body;
  const query = `
    INSERT INTO users (first_name, last_name, email, password, birth_date, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(query, [first_name, last_name, email, password, birth_date, role], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, first_name, last_name, email, role });
    }
  });
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, password, birth_date, role } = req.body;
  const query = `
    UPDATE users
    SET first_name = ?, last_name = ?, email = ?, password = ?, birth_date = ?, role = ?
    WHERE id = ?
  `;
  db.run(query, [first_name, last_name, email, password, birth_date, role, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ updated: this.changes });
    }
  });
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";
  db.run(query, id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ deleted: this.changes });
    }
  });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
