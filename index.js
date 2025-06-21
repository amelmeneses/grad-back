// backend/index.js

// Atrapar errores inesperados
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const bodyParser = require('body-parser');

// Sequelize + raw-SQL DB
const initializeDB = require('./config/database');
const sequelize    = require('./config/db');

// Controllers
const { activateAnonUser } = require('./controllers/userController');

// Routers
const authRoutes        = require('./routes/authRoutes');
const userRoutes        = require('./routes/userRoutes');
const roleRoutes        = require('./routes/roleRoutes');
const empresaRoutes     = require('./routes/empresaRoutes');
const facturacionRoutes = require('./routes/facturacionRoutes');
const canchaRoutes      = require('./routes/canchaRoutes');
const tarifaRoutes      = require('./routes/tarifaAlquilerRoutes');
const horarioRoutes     = require('./routes/horarioFuncionamientoRoutes');

const app = express();

// 1) Inicializar/crear tablas en SQLite (estructura + datos semilla)
initializeDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 1) Public activation endpoint (no auth)
app.get('/activate/:token', activateAnonUser);

// 2) Mount all /api routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', roleRoutes);
app.use('/api', empresaRoutes);
app.use('/api', facturacionRoutes);
app.use('/api', canchaRoutes);
app.use('/api', tarifaRoutes);
app.use('/api', horarioRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

// Sync Sequelize (no drops) and start server
sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized');
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
