// backend/scripts/addActivationTokenColumn.js

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./playbooker.db');

db.serialize(() => {
  db.run(
    `ALTER TABLE usuarios
     ADD COLUMN activation_token VARCHAR(255);`,
    (err) => {
      if (err && !/duplicate column name/i.test(err.message)) {
        console.error("Error al agregar columna:", err);
      } else {
        console.log("Columna activation_token agregada correctamente (o ya existía).");
      }
      db.close();
    }
  );
});
