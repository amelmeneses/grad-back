// tasks/cancelExpired.js
require('dotenv').config();
const { sequelize } = require('../config/database');
const reservaService = require('../services/reservaService');

(async () => {
  try {
    await sequelize.authenticate();
    const count = await reservaService.cancelarReservasExpiradas();
    console.log(`✅ Canceladas ${count} reservas pendientes expiradas.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error cancelando reservas expiradas:', err);
    process.exit(1);
  }
})();
