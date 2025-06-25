// backend/index.js

// Atrapar errores inesperados
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
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
const reservaRoutes     = require('./routes/reservaRoutes');

const app = express();
const { iniciarCancelacionAutomatica } = require('./jobs/cronCancelaciones');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

// Public activation endpoint (no auth)
app.get('/api/activate/:token', activateAnonUser);

// Mount all /api routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', roleRoutes);
app.use('/api', empresaRoutes);
app.use('/api', facturacionRoutes);
app.use('/api', canchaRoutes);
app.use('/api', tarifaRoutes);
app.use('/api', horarioRoutes);
app.use('/api', reservaRoutes);

// Iniciar CRON
iniciarCancelacionAutomatica();

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

// Iniciar servidor sin reseed automático en development
(async () => {
  try {
    // Solo sincronizar sin dropear, seeds se ejecutan manualmente
    await sequelize.sync({ force: false });
    console.log('Database synchronized');

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error initializing server:', error);
    process.exit(1);
  }
})();
