PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE roles (
        id INTEGER PRIMARY KEY,
        nombre VARCHAR(50),
        descripcion TEXT
      );
INSERT INTO roles VALUES(1,'admin','Administrador con acceso total');
INSERT INTO roles VALUES(2,'usuario','Usuario regular con acceso limitado');
INSERT INTO roles VALUES(3,'empresa','Representante de empresa');
CREATE TABLE `empresas` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `nombre` VARCHAR(255) NOT NULL, `contacto_email` VARCHAR(255) NOT NULL, `contacto_telefono` VARCHAR(255) NOT NULL, `direccion` VARCHAR(255) NOT NULL, `usuario_id` INTEGER NOT NULL REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE);
INSERT INTO empresas VALUES(1,'Justlift SA','jlgymec@gmail.com','0993804018','california alta',5);
INSERT INTO empresas VALUES(2,'AVIANCACITO','aviancacito@gmail.com','0993804018','california',6);
CREATE TABLE usuarios (
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
INSERT INTO usuarios VALUES(1,'Amel','Meneses','amelsabine@gmail.com','$2b$10$DOEtY3NBPwBUhWls7oVXI.1xfI2HJAHG.dX23a2BiccfC0EvB61Ay',1,1,'2025-06-06 22:42:13');
INSERT INTO usuarios VALUES(3,'Daniel','Sanchez','danielsanchez@gmail.com','$2b$10$JpA1163yk8F9aqW9trW3seai4n/hJYAhdHOWZ6TjzHGi1Sd9ja0w2',2,1,'2025-06-06 22:54:55.924 +00:00');
INSERT INTO usuarios VALUES(4,'Ariadna','Meneses','ariadnameneses@gmail.com','$2b$10$dk3TDHNp8ugqIFwZvl4iI.pUnlc0Kf9l2PtPs34aFgM09v7REG8sy',2,1,'2025-06-06 22:55:22.658 +00:00');
INSERT INTO usuarios VALUES(5,'Sabine','Fabara','asmenesesi@puce.edu.ec','$2b$10$wdK/XQo1DTVYJ4zU4BgsYuQLYFBI1g/DpPc0dpU1xV1PDT36LyiCa',3,1,'2025-06-06 22:56:02.521 +00:00');
INSERT INTO usuarios VALUES(6,'jose','Sevillano','josesevillano@hotmail.com','$2b$10$smeSV8cdr4cdoZZi5cb7O.lKVKkjKBq5GEkJD3R0oqWGhZzdXvsbK',3,1,'2025-06-06 22:57:47.118 +00:00');
CREATE TABLE facturacion (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_facturador VARCHAR(100) NOT NULL,
        cedula_o_ruc VARCHAR(50) NOT NULL,
        correo_electronico VARCHAR(100) NOT NULL,
        direccion VARCHAR(255) NOT NULL,
        telefono VARCHAR(20) NOT NULL,
        usuario_id INTEGER NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      );
CREATE TABLE horarios_funcionamiento (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        empresa_id INTEGER,
        dia_semana VARCHAR(20),
        hora_apertura TIME,
        hora_cierre TIME,
        FOREIGN KEY (empresa_id) REFERENCES empresas(id)
      );
CREATE TABLE canchas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(100),
        descripcion TEXT,
        ubicacion VARCHAR(255),
        empresa_id INTEGER,
        FOREIGN KEY (empresa_id) REFERENCES empresas(id)
      );
CREATE TABLE calendario_disponibilidad (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cancha_id INTEGER,
        fecha DATE,
        hora TIME,
        estado VARCHAR(50),
        horario_funcionamiento_id INTEGER,
        FOREIGN KEY (cancha_id) REFERENCES canchas(id),
        FOREIGN KEY (horario_funcionamiento_id) REFERENCES horarios_funcionamiento(id)
      );
CREATE TABLE servicios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(100),
        descripcion TEXT,
        precio DECIMAL(10,2),
        tipo VARCHAR(50)
      );
CREATE TABLE reservas (
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
CREATE TABLE reserva_servicios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reserva_id INTEGER,
        servicio_id INTEGER,
        FOREIGN KEY (reserva_id) REFERENCES reservas(id),
        FOREIGN KEY (servicio_id) REFERENCES servicios(id)
      );
CREATE TABLE pagos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reserva_id INTEGER,
        monto_total DECIMAL(10,2),
        estado_pago VARCHAR(50),
        fecha_pago TIMESTAMP,
        metodo_pago VARCHAR(50),
        FOREIGN KEY (reserva_id) REFERENCES reservas(id)
      );
CREATE TABLE tarifas_alquiler (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        empresa_id INTEGER,
        deporte VARCHAR(50),
        hora_inicio TIME,
        hora_fin TIME,
        tarifa DECIMAL(10,2),
        FOREIGN KEY (empresa_id) REFERENCES empresas(id)
      );
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('usuarios',6);
INSERT INTO sqlite_sequence VALUES('empresas',2);
COMMIT;
