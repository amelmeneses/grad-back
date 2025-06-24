// models/canchaModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Cancha extends Sequelize.Model {}

Cancha.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ubicacion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  deporte: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  estado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // 0 = inactivo, 1 = activo, por ejemplo
  },
  imagen_principal: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  empresa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'empresas',
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Cancha',
  tableName: 'canchas',
  timestamps: false,
});

// *Asociaciones con TarifaAlquiler* (1:N)
setImmediate(() => {
  const { TarifaAlquiler } = require('./tarifaAlquilerModel');
  Cancha.hasMany(TarifaAlquiler, { foreignKey: 'cancha_id', as: 'tarifas' });
});

module.exports = { Cancha };