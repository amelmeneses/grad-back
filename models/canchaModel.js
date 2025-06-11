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
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ubicacion: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  deporte: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  empresa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'empresas',
      key: 'id'
    }
  }
}, {
  tableName: 'canchas',
  timestamps: false
});

module.exports = Cancha;
