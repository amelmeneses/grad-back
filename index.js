// backend/index.js

// Atrapar errores inesperados
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

require('dotenv').config();
const express             = require('express');
const cors                = require('cors');
const bodyParser          = require('body-parser');

// 1) Inicialización de la base SQLite (raw SQL)
const initializeDB        = require('./config/database');
// 2) Instancia de Sequelize para modelos
const sequelize           = require('./config/db');

// 3) Importar rutas
const authRoutes          = require('./routes/authRoutes');
const userRoutes          = require('./routes/userRoutes');
const roleRoutes          = require('./routes/roleRoutes');
const empresaRoutes       = require('./routes/empresaRoutes');
const facturacionRoutes   = require('./routes/facturacionRoutes');
const canchaRoutes        = require('./routes/canchaRoutes');
const tarifaRoutes        = require('./routes/tarifaAlquilerRoutes');


const app = express();

// Inicializar/crear tablas en SQLite (estructura + datos semilla)
initializeDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Montar todas las rutas bajo el prefijo /api
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', roleRoutes);
app.use('/api', empresaRoutes);
app.use('/api', facturacionRoutes);
app.use('/api', canchaRoutes);
app.use('/api', tarifaRoutes);

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

// Sincronizar modelos de Sequelize sin forzar DROP de tablas
sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized');
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});