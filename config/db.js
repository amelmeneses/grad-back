// backend/config/db.js
const { Sequelize } = require('sequelize');

// Correct path to the database file
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './playbooker.db',  // Adjusted to match your path
});

module.exports = sequelize;
