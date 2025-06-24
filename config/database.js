// config/database.js

const bcrypt   = require("bcryptjs");
const sqlite3  = require("sqlite3").verbose();
const db       = new sqlite3.Database("./playbooker.db", (err) => {
  if (err) {
    console.error("Error connecting to SQLite:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

function initializeDB() {
  console.log('Inicializando la base de datos...');

  db.serialize(() => {
    // — Drop existing tables for a clean slate (dev only) —
    db.run("DROP TABLE IF EXISTS reserva_servicios");
    db.run("DROP TABLE IF EXISTS reservas");
    db.run("DROP TABLE IF EXISTS servicios");
    db.run("DROP TABLE IF EXISTS factura_servicios");
    db.run("DROP TABLE IF EXISTS facturacion");
    db.run("DROP TABLE IF EXISTS facturas");
    db.run("DROP TABLE IF EXISTS canchas");
    db.run("DROP TABLE IF EXISTS usuarios");
    db.run("DROP TABLE IF EXISTS empresas");
    db.run("DROP TABLE IF EXISTS horarios_funcionamiento");
    db.run("DROP TABLE IF EXISTS calendario_disponibilidad");
    db.run("DROP TABLE IF EXISTS tarifas_alquiler");
    db.run("DROP TABLE IF EXISTS pagos");
    db.run("DROP TABLE IF EXISTS horarios_bloqueados");
    console.log("Tablas existentes eliminadas.");

    // roles
    db.run(`
      CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY,
        nombre VARCHAR(50),
        descripcion TEXT
      );
    `);

    // usuarios (ahora con activation_token)
    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(100),
        apellido VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        contrasena VARCHAR(255),
        rol_id INTEGER,
        estado INTEGER DEFAULT 1,
        activation_token VARCHAR(255),  -- nuevo campo para registro anónimo
        fecha_creacion TIMESTAMP,
        FOREIGN KEY (rol_id) REFERENCES roles(id)
      );
    `);

    // empresas
    db.run(`
      CREATE TABLE IF NOT EXISTS empresas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(100),
        contacto_email VARCHAR(100),
        contacto_telefono VARCHAR(20),
        direccion VARCHAR(255),
        usuario_id INTEGER,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      );
    `);

    // facturacion
    db.run(`
      CREATE TABLE IF NOT EXISTS facturacion (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_facturador VARCHAR(100) NOT NULL,
        cedula_o_ruc VARCHAR(50) NOT NULL,
        correo_electronico VARCHAR(100) NOT NULL,
        direccion VARCHAR(255) NOT NULL,
        telefono VARCHAR(20) NOT NULL,
        usuario_id INTEGER NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      );
    `);

    // horarios_funcionamiento
    db.run(`
      CREATE TABLE IF NOT EXISTS horarios_funcionamiento (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cancha_id INTEGER NOT NULL,
        dia_semana VARCHAR(20),
        hora_apertura TIME,
        hora_cierre TIME,
        FOREIGN KEY (cancha_id) REFERENCES canchas(id)
      );
    `);

    // canchas con nuevo campo estado
    db.run(`
      CREATE TABLE IF NOT EXISTS canchas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(100),
        descripcion TEXT,
        ubicacion VARCHAR(255),
        deporte VARCHAR(50) NOT NULL,
        estado INTEGER NOT NULL DEFAULT 0,
        imagen_principal TEXT NOT NULL,
        empresa_id INTEGER,
        FOREIGN KEY (empresa_id) REFERENCES empresas(id)
      );
    `);

    // calendario_disponibilidad
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

    // servicios
    db.run(`
      CREATE TABLE IF NOT EXISTS servicios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(100),
        descripcion TEXT,
        precio DECIMAL(10,2),
        tipo VARCHAR(50)
      );
    `);

    // reservas
    db.run(`
      CREATE TABLE IF NOT EXISTS reservas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        cancha_id INTEGER,
        fecha DATE,
        hora_inicio TIME,
        hora_fin TIME,
        estado VARCHAR(50),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (cancha_id) REFERENCES canchas(id)
      );
    `);

    // reserva_servicios
    db.run(`
      CREATE TABLE IF NOT EXISTS reserva_servicios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reserva_id INTEGER,
        servicio_id INTEGER,
        FOREIGN KEY (reserva_id) REFERENCES reservas(id),
        FOREIGN KEY (servicio_id) REFERENCES servicios(id)
      );
    `);

    // pagos
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

    // tarifas_alquiler
    db.run(`
      CREATE TABLE IF NOT EXISTS tarifas_alquiler (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cancha_id INTEGER NOT NULL,
        dia_semana VARCHAR(20),
        "default" INTEGER NOT NULL DEFAULT 0,
        hora_inicio TIME NOT NULL,
        hora_fin TIME NOT NULL,
        tarifa DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (cancha_id) REFERENCES canchas(id)
      );
    `);

    // horarios_bloqueados
    db.run(`
      CREATE TABLE IF NOT EXISTS horarios_bloqueados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cancha_id INTEGER NOT NULL,
        fecha DATE NOT NULL,
        hora_desde TIME NOT NULL,
        hora_hasta TIME NOT NULL,
        motivo TEXT,
        FOREIGN KEY (cancha_id) REFERENCES canchas(id)
      );
    `);
    console.log("Tabla horarios_bloqueados creada.");

    // seed roles
    db.run("DELETE FROM roles");
    [
      { id: 1, nombre: 'admin',    descripcion: 'Administrador con acceso total' },
      { id: 2, nombre: 'usuario',  descripcion: 'Usuario regular con acceso limitado' },
      { id: 3, nombre: 'empresa',  descripcion: 'Representante de empresa' },
    ].forEach(role => {
      db.run(
        `INSERT INTO roles (id, nombre, descripcion) VALUES (?, ?, ?)`,
        [role.id, role.nombre, role.descripcion]
      );
    });

    // seed an admin user
    const plainPwd = 'sabineamel12@';
    bcrypt.hash(plainPwd, 10, (errHash, hashed) => {
      if (!errHash) {
        db.run(
          `INSERT INTO usuarios 
             (nombre, apellido, email, contrasena, rol_id, estado, activation_token, fecha_creacion)
           VALUES 
             ('Amel', 'Meneses', 'amelsabine@gmail.com', ?, 1, 1, NULL, CURRENT_TIMESTAMP)`,
          [hashed]
        );
      }
    });

    console.log("Inicialización de tablas completada.");
  });
}

module.exports = initializeDB;
