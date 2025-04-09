
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./playbooker.db", (err) => {
  if (err) {
    console.error("Error connecting to SQLite:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Drop existing tables if they exist (optional, for development/reset only)
db.serialize(() => {
  db.run("DROP TABLE IF EXISTS reservation_services");
  db.run("DROP TABLE IF EXISTS reservations");
  db.run("DROP TABLE IF EXISTS services");
  db.run("DROP TABLE IF EXISTS courts");
  db.run("DROP TABLE IF EXISTS users");
  db.run("DROP TABLE IF EXISTS companies");

  // Create tables
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      birth_date TEXT,
      role TEXT
    )
  `);

  db.run(`
    CREATE TABLE companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      location TEXT
    )
  `);

  db.run(`
    CREATE TABLE courts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price_per_hour REAL,
      sport_type TEXT,
      location TEXT,
      company_id INTEGER NOT NULL,
      FOREIGN KEY (company_id) REFERENCES companies(id)
    )
  `);

  db.run(`
    CREATE TABLE reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      court_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      status TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (court_id) REFERENCES courts(id)
    )
  `);

  db.run(`
    CREATE TABLE services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL,
      court_id INTEGER NOT NULL,
      FOREIGN KEY (court_id) REFERENCES courts(id)
    )
  `);
});

module.exports = db;
