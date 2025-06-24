// models/reservaModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Reserva extends Sequelize.Model {}

Reserva.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id',
    },
  },
  cancha_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'canchas',
      key: 'id',
    },
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'pendiente',
  },
}, {
  sequelize,
  modelName: 'Reserva',
  tableName: 'reservas',
  timestamps: false,
});

// *Asociación inversa* a Usuario y Cancha
setImmediate(() => {
  const { Usuario } = require('./usuarioModel');
  const { Cancha } = require('./canchaModel');

  Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
  Reserva.belongsTo(Cancha, { foreignKey: 'cancha_id', as: 'cancha' });
});

module.exports = { Reserva };
