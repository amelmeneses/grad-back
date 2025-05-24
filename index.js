process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const initializeDB = require('./config/database'); // Asegúrate de que la ruta sea correcta
const sequelize = require('./config/db');  // Importa sequelize correctamente
const authRoutes = require("./routes/authRoutes"); // Importa las rutas de autenticación
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require('./routes/roleRoutes');
const empresaRoutes = require('./routes/empresaRoutes');

// Inicializa la base de datos
initializeDB(); 

const app = express();

// Middleware
app.use(cors()); // Habilitar CORS para permitir solicitudes entre dominios (desde el frontend)
app.use(bodyParser.json()); // Middleware para parsear cuerpos de solicitud JSON
app.use(bodyParser.urlencoded({ extended: true })); // Middleware para parsear cuerpos de solicitud con URL-encoded


// Usar las rutas de autenticación
app.use("/api", authRoutes); 
// Rutas de usuario (incluye GET /api/users protegido)
app.use("/api", userRoutes);
app.use('/api', roleRoutes);
app.use('/api', empresaRoutes);

// Sync models with the database
sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized");
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

