// backend/models/canchaModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cancha = sequelize.define('Cancha', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deporte: {
    type: DataTypes.STRING,
    allowNull: false
  },
  empresa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'empresas', key: 'id' }
  }
}, {
  tableName: 'canchas',
  timestamps: false
});

module.exports = Cancha;
