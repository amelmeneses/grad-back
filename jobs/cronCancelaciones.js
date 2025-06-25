// jobs/cronCancelaciones.js
const cron = require('node-cron');
const reservaService = require('../services/reservaService');

function iniciarCancelacionAutomatica() {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const cantidad = await reservaService.cancelarReservasExpiradas();
      if (cantidad > 0) {
        console.log(`[CRON] ${cantidad} reservas expiradas canceladas.`);
      } else {
        console.log(`[CRON] No hay reservas expiradas.`);
      }
    } catch (error) {
      console.error('[CRON] Error cancelando reservas expiradas:', error);
    }
  });
}

module.exports = { iniciarCancelacionAutomatica };
