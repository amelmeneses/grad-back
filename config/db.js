const { Sequelize } = require('sequelize');

// Configuración de la base de datos SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db/playbooker.db', // Ruta del archivo SQLite
});

module.exports = sequelize;
