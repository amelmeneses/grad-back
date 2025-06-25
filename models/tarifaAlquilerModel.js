// backend/models/tarifaAlquilerModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class TarifaAlquiler extends Sequelize.Model {}

TarifaAlquiler.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cancha_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'canchas',
      key: 'id',
    },
  },
  dia_semana: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  es_default: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  tarifa: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'TarifaAlquiler',
  tableName: 'tarifas_alquiler',
  timestamps: false,
});

// *Asociación inversa* a Cancha
setImmediate(() => {
  const { Cancha } = require('./canchaModel');
  TarifaAlquiler.belongsTo(Cancha, { foreignKey: 'cancha_id', as: 'cancha' });
});

module.exports = { TarifaAlquiler };
