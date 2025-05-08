
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const initializeDB = require("./config/database"); // Asegúrate de que la ruta de la base de datos sea correcta
const authRoutes = require("./routes/authRoutes"); // Importa las rutas de autenticación

// Inicializar la base de datos
initializeDB(); // Aquí se llama la función que crea las tablas en la base de datos

const app = express();

// Middleware
app.use(cors()); // Habilitar CORS para permitir solicitudes entre dominios (desde el frontend)
app.use(bodyParser.json()); // Middleware para parsear cuerpos de solicitud JSON
app.use(bodyParser.urlencoded({ extended: true })); // Middleware para parsear cuerpos de solicitud con URL-encoded


// // // Importar las rutas (definidas en los archivos correspondientes)
// // const userRoutes = require("./routes/users");
// // const companyRoutes = require("./routes/companies");
// // const courtRoutes = require("./routes/courts");
// // const reservationRoutes = require("./routes/reservations");
// // const serviceRoutes = require("./routes/services");



// Usar las rutas de autenticación
app.use("/api", authRoutes);  // Registra las rutas de autenticación bajo el prefijo '/api'
// // app.use("/users", userRoutes);
// // app.use("/companies", companyRoutes);
// // app.use("/courts", courtRoutes);
// // app.use("/reservations", reservationRoutes);
// // app.use("/services", serviceRoutes);


// Configuración del puerto
const PORT = 5001;  // El backend escucha en el puerto 5001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
