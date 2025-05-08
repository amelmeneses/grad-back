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
    // Eliminar tablas existentes (opcional, solo para desarrollo o reiniciar)
    db.run("DROP TABLE IF EXISTS reserva_servicios");
    db.run("DROP TABLE IF EXISTS reservas");
    db.run("DROP TABLE IF EXISTS servicios");
    db.run("DROP TABLE IF EXISTS canchas");
    db.run("DROP TABLE IF EXISTS usuarios");
    db.run("DROP TABLE IF EXISTS empresas");
    db.run("DROP TABLE IF EXISTS horarios_funcionamiento");
    db.run("DROP TABLE IF EXISTS calendario_disponibilidad");
    db.run("DROP TABLE IF EXISTS tarifas_alquiler");
    db.run("DROP TABLE IF EXISTS pagos");

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

    // Eliminar todos los roles para evitar duplicados
    db.run("DELETE FROM roles", (err) => {
      if (err) {
        console.error("Error al eliminar roles anteriores:", err);
      } else {
        console.log("Roles anteriores eliminados.");
        // Reiniciar el contador de AUTOINCREMENT
        db.run("VACUUM", (err) => {  // Reinicia el contador de AUTOINCREMENT
          if (err) {
            console.error("Error al reiniciar el contador de AUTOINCREMENT:", err);
          } else {
            console.log("Contador AUTOINCREMENT reiniciado.");
          }
        });
      }
    });

    // Insertar los tres roles necesarios: admin, usuarios, empresas
    const roles = [
      { nombre: 'admin', descripcion: 'Administrador con acceso total' },
      { nombre: 'usuarios', descripcion: 'Usuarios regulares con acceso limitado' },
      { nombre: 'empresas', descripcion: 'Representantes de empresas para gestión de reservas' },
    ];

    roles.forEach((role) => {
      db.run(`
        INSERT INTO roles (nombre, descripcion)
        VALUES (?, ?)
      `, [role.nombre, role.descripcion], (err) => {
        if (err) {
          console.error(`Error al insertar el rol ${role.nombre}:`, err);
        } else {
          console.log(`Rol ${role.nombre} insertado exitosamente.`);
        }
      });
    });

    // Crear un usuario admin con contraseña encriptada
    const password = 'sabineamel12@';
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Error al encriptar la contraseña:", err);
      } else {
        // Insertar el usuario admin en la base de datos con la contraseña encriptada
        const query = `
          INSERT INTO usuarios (nombre, apellido, email, contrasena, rol_id, fecha_creacion)
          VALUES ('Amel', 'Meneses', 'amelsabine@gmail.com', ?, 1, CURRENT_TIMESTAMP);
        `;
        db.run(query, [hashedPassword], (err) => {
          if (err) {
            console.error("Error al insertar el usuario admin:", err);
          } else {
            console.log("Usuario admin creado exitosamente.");
          }
        });
      }
    });

    console.log("Tablas creadas correctamente.");
  });
}

// Exportar la función para su uso en otros archivos
module.exports = initializeDB;
