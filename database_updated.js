
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

  console.log("Tablas existentes eliminadas.");
});

// Crear las tablas si no existen
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(50),
      descripcion TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(100),
      apellido VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      contrasena VARCHAR(255),
      rol_id INTEGER,
      fecha_creacion TIMESTAMP,
      FOREIGN KEY (rol_id) REFERENCES roles(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS empresas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(100),
      contacto_email VARCHAR(100),
      contacto_telefono VARCHAR(20),
      direccion VARCHAR(255)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS horarios_funcionamiento (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      empresa_id INTEGER,
      dia_semana VARCHAR(20),
      hora_apertura TIME,
      hora_cierre TIME,
      FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS canchas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(100),
      descripcion TEXT,
      ubicacion VARCHAR(255),
      empresa_id INTEGER,
      FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS calendario_disponibilidad (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cancha_id INTEGER,
      fecha DATE,
      hora TIME,
      estado VARCHAR(50),
      horario_funcionamiento_id INTEGER,
      FOREIGN KEY (cancha_id) REFERENCES canchas(id),
      FOREIGN KEY (horario_funcionamiento_id) REFERENCES horarios_funcionamiento(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS servicios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(100),
      descripcion TEXT,
      precio DECIMAL(10,2),
      tipo VARCHAR(50)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reservas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER,
      cancha_id INTEGER,
      fecha TIMESTAMP,
      hora_inicio TIME,
      hora_fin TIME,
      estado VARCHAR(50),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY (cancha_id) REFERENCES canchas(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reserva_servicios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reserva_id INTEGER,
      servicio_id INTEGER,
      FOREIGN KEY (reserva_id) REFERENCES reservas(id),
      FOREIGN KEY (servicio_id) REFERENCES servicios(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS pagos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reserva_id INTEGER,
      monto_total DECIMAL(10,2),
      estado_pago VARCHAR(50),
      fecha_pago TIMESTAMP,
      metodo_pago VARCHAR(50),
      FOREIGN KEY (reserva_id) REFERENCES reservas(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tarifas_alquiler (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      empresa_id INTEGER,
      deporte VARCHAR(50),
      hora_inicio TIME,
      hora_fin TIME,
      tarifa DECIMAL(10,2),
      FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    );
  `);
});

// Función para insertar un nuevo rol
function insertarRol(nombre, descripcion) {
  db.run(`INSERT INTO roles (nombre, descripcion) VALUES (?, ?)`, [nombre, descripcion], function(err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`Nuevo rol agregado con ID ${this.lastID}`);
    }
  });
}

// Función para obtener todos los roles
function obtenerRoles() {
  db.all(`SELECT * FROM roles`, [], (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Roles:", rows);
    }
  });
}

// Función para cerrar la base de datos
function cerrarBaseDeDatos() {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Conexión cerrada');
    }
  });
}

// Ejemplo de uso
insertarRol("Administrador", "Gestión total del sistema");
obtenerRoles();

// Cierra la base de datos al final
cerrarBaseDeDatos();
