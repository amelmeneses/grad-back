const sqlite3 = require("sqlite3").verbose();

// Crear y conectar la base de datos
const db = new sqlite3.Database("./playbooker.db", (err) => {
  if (err) {
    console.error("Error connecting to SQLite:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Función para inicializar la base de datos
function initializeDB() {
  console.log('Inicializando la base de datos...'); // Log para verificar si la función se está ejecutando
  
  db.serialize(() => {
    // Eliminar tablas existentes (opcional, solo para desarrollo o reiniciar)
    db.run("DROP TABLE IF EXISTS reserva_servicios", (err) => {
      if (err) console.error("Error al eliminar tabla reserva_servicios:", err);
    });
    db.run("DROP TABLE IF EXISTS reservas", (err) => {
      if (err) console.error("Error al eliminar tabla reservas:", err);
    });
    db.run("DROP TABLE IF EXISTS servicios", (err) => {
      if (err) console.error("Error al eliminar tabla servicios:", err);
    });
    db.run("DROP TABLE IF EXISTS canchas", (err) => {
      if (err) console.error("Error al eliminar tabla canchas:", err);
    });
    db.run("DROP TABLE IF EXISTS usuarios", (err) => {
      if (err) console.error("Error al eliminar tabla usuarios:", err);
    });
    db.run("DROP TABLE IF EXISTS empresas", (err) => {
      if (err) console.error("Error al eliminar tabla empresas:", err);
    });
    db.run("DROP TABLE IF EXISTS horarios_funcionamiento", (err) => {
      if (err) console.error("Error al eliminar tabla horarios_funcionamiento:", err);
    });
    db.run("DROP TABLE IF EXISTS calendario_disponibilidad", (err) => {
      if (err) console.error("Error al eliminar tabla calendario_disponibilidad:", err);
    });
    db.run("DROP TABLE IF EXISTS tarifas_alquiler", (err) => {
      if (err) console.error("Error al eliminar tabla tarifas_alquiler:", err);
    });
    db.run("DROP TABLE IF EXISTS pagos", (err) => {
      if (err) console.error("Error al eliminar tabla pagos:", err);
    });

    console.log("Tablas existentes eliminadas.");

    // Crear las tablas si no existen
    db.run(`
      CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(50),
        descripcion TEXT
      );
    `);
    console.log("Tabla roles creada.");

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
    console.log("Tabla usuarios creada.");

    db.run(`
      CREATE TABLE IF NOT EXISTS empresas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(100),
        contacto_email VARCHAR(100),
        contacto_telefono VARCHAR(20),
        direccion VARCHAR(255)
      );
    `);
    console.log("Tabla empresas creada.");
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
    console.log("Tabla horarios_funcionamiento creada.");
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
    console.log("Tabla canchas creada.");
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
    console.log("Tabla calendario_disponibilidad creada.");
    db.run(`
      CREATE TABLE IF NOT EXISTS servicios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(100),
        descripcion TEXT,
        precio DECIMAL(10,2),
        tipo VARCHAR(50)
      );
    `);
    console.log("Tabla servicios creada.");
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
    console.log("Tabla reservas creada.");
    db.run(`
      CREATE TABLE IF NOT EXISTS reserva_servicios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reserva_id INTEGER,
        servicio_id INTEGER,
        FOREIGN KEY (reserva_id) REFERENCES reservas(id),
        FOREIGN KEY (servicio_id) REFERENCES servicios(id)
      );
    `);
    console.log("Tabla reserva_servicios creada.");
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
    console.log("Tabla pagos creada.");
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
    console.log("Tabla tarifas_alquiler creada.");
    console.log("Tablas creadas correctamente.");
  });
}

// Exportar la función para su uso en otros archivos
module.exports = initializeDB;
