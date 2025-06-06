// backend/config/database.js

const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./playbooker.db", (err) => {
  if (err) {
    console.error("Error connecting to SQLite:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Función para inicializar la base de datos
function initializeDB() {
  console.log('Inicializando la base de datos...');

  db.serialize(() => {
    // 1) Eliminar tablas existentes (opcional, solo para desarrollo o reiniciar)
    db.run("DROP TABLE IF EXISTS reserva_servicios");
    db.run("DROP TABLE IF EXISTS reservas");
    db.run("DROP TABLE IF EXISTS servicios");
    db.run("DROP TABLE IF EXISTS factura_servicios"); // si existiera
    db.run("DROP TABLE IF EXISTS facturacion");
    db.run("DROP TABLE IF EXISTS facturas");            // nombre alternativo; no se usará
    db.run("DROP TABLE IF EXISTS canchas");
    db.run("DROP TABLE IF EXISTS usuarios");
    db.run("DROP TABLE IF EXISTS empresas");
    db.run("DROP TABLE IF EXISTS horarios_funcionamiento");
    db.run("DROP TABLE IF EXISTS calendario_disponibilidad");
    db.run("DROP TABLE IF EXISTS tarifas_alquiler");
    db.run("DROP TABLE IF EXISTS pagos");
    console.log("Tablas existentes eliminadas.");

    // 2) Crear tabla roles
    db.run(`
      CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY,
        nombre VARCHAR(50),
        descripcion TEXT
      );
    `);
    console.log("Tabla roles creada.");

    // 3) Crear tabla usuarios (con campo 'estado' por defecto = 1)
    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(100),
        apellido VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        contrasena VARCHAR(255),
        rol_id INTEGER,
        estado INTEGER DEFAULT 1,          -- 1 = activo, 0 = inactivo
        fecha_creacion TIMESTAMP,
        FOREIGN KEY (rol_id) REFERENCES roles(id)
      );
    `);
    console.log("Tabla usuarios creada (con campo estado).");

    // 4) Crear tabla empresas (relación a usuarios)
    db.run(`
      CREATE TABLE IF NOT EXISTS empresas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(100),
        contacto_email VARCHAR(100),
        contacto_telefono VARCHAR(20),
        direccion VARCHAR(255),
        usuario_id INTEGER,  -- owner
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      );
    `);
    console.log("Tabla empresas creada (con referencia a usuarios).");

    // 5) Crear tabla facturación (datos de facturación) → uno a muchos con usuarios
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
    console.log("Tabla facturacion creada (datos de facturación).");

    // 6) Crear tabla horarios_funcionamiento
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

    // 7) Crear tabla canchas
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

    // 8) Crear tabla calendario_disponibilidad
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

    // 9) Crear tabla servicios
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

    // 10) Crear tabla reservas
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

    // 11) Crear tabla reserva_servicios
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

    // 12) Crear tabla pagos
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

    // 13) Crear tabla tarifas_alquiler
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

    // 14) Semilla de roles
    db.run("DELETE FROM roles", err => {
      if (err) console.error("Error al eliminar roles anteriores:", err);
      else console.log("Roles anteriores eliminados.");
    });

    const rolesSeed = [
      { id: 1, nombre: 'admin',    descripcion: 'Administrador con acceso total' },
      { id: 2, nombre: 'usuario',  descripcion: 'Usuario regular con acceso limitado' },
      { id: 3, nombre: 'empresa',  descripcion: 'Representante de empresa' },
    ];

    rolesSeed.forEach(role => {
      db.run(
        `INSERT INTO roles (id, nombre, descripcion) VALUES (?, ?, ?)`,
        [role.id, role.nombre, role.descripcion],
        err => err
          ? console.error(`Error al insertar el rol ${role.nombre}:`, err)
          : console.log(`Rol ${role.nombre} insertado.`)
      );
    });

    // 15) Crear usuario admin de ejemplo
    const plainPwd = 'sabineamel12@';
    bcrypt.hash(plainPwd, 10, (errHash, hashed) => {
      if (errHash) {
        console.error("Error al encriptar contraseña:", errHash);
      } else {
        db.run(
          `INSERT INTO usuarios 
             (nombre, apellido, email, contrasena, rol_id, estado, fecha_creacion)
           VALUES 
             ('Amel', 'Meneses', 'amelsabine@gmail.com', ?, 1, 1, CURRENT_TIMESTAMP)`,
          [hashed],
          err2 => err2
            ? console.error("Error al crear admin:", err2)
            : console.log("Usuario admin creado exitosamente.")
        );
      }
    });

    console.log("Inicialización de tablas completada.");
  });
}

module.exports = initializeDB;

