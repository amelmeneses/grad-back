// backend/index.js

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// 1) Inicialización de la DB SQLite (raw‐SQL)
const initializeDB = require('./config/database');

// 2) Instancia de Sequelize para modelos
const sequelize = require('./config/db');

// 3) Importar rutas
const authRoutes       = require('./routes/authRoutes');
const userRoutes       = require('./routes/userRoutes');
const roleRoutes       = require('./routes/roleRoutes');
const empresaRoutes    = require('./routes/empresaRoutes');
const facturacionRoutes = require('./routes/facturacionRoutes');

const app = express();

// Inicializar base SQLite (crea/recrea tablas)
initializeDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Montar rutas bajo /api
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', roleRoutes);
app.use('/api', empresaRoutes);
app.use('/api', facturacionRoutes);

// Middleware genérico para capturar y devolver errores en JSON
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

// Sincronizar modelos Sequelize (no forzar borrado de tablas existentes)
sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized");
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
