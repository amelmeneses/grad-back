// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const initializeDB = require('./config/database'); // Asegúrate de que la ruta sea correcta
const sequelize = require('./config/db');  // Importa sequelize correctamente
const authRoutes = require("./routes/authRoutes"); // Importa las rutas de autenticación

// Inicializa la base de datos
initializeDB(); 

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

// Sync models with the database
sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized");
  // Aquí puedes agregar el código para arrancar el servidor
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
