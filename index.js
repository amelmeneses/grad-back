const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();

app.use(cors());
app.use(bodyParser.json()); // Middleware to parse JSON body
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded data

// API Endpoints
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
  const { name, email, age } = req.body;
  const query = "INSERT INTO users (name, email, age) VALUES (?, ?, ?)";
  db.run(query, [name, email, age], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, name, email, age });
    }
  });
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  const query = "UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?";
  db.run(query, [name, email, age, id], function (err) {
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
