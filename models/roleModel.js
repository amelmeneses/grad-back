const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // Importamos la configuración de Sequelize

const Rol = sequelize.define('Rol', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = { Rol };
