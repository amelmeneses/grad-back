// backend/models/horarioFuncionamientoModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class HorarioFuncionamiento extends Sequelize.Model {}

HorarioFuncionamiento.init({
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
  hora_apertura: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  hora_cierre: {
    type: DataTypes.TIME,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'HorarioFuncionamiento',
  tableName: 'horarios_funcionamiento',
  timestamps: false,
});

module.exports = { HorarioFuncionamiento };
