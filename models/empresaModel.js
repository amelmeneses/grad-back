// backend/models/empresaModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { Usuario } = require('./userModel');

class Empresa extends Sequelize.Model {}

Empresa.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contacto_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contacto_telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Empresa',
  tableName: 'empresas',
  timestamps: false,
});

// *Asociaciones*
// Usuario ↔️ Empresa
Empresa.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'Usuario' });
Usuario.hasMany(Empresa, { foreignKey: 'usuario_id', as: 'Empresas' });

// Para no requerir aquí mismo a Cancha (evita circularidad),
// importamos al final del archivo:
setImmediate(() => {
  const { Cancha } = require('./canchaModel');
  Empresa.hasMany(Cancha, { foreignKey: 'empresa_id', as: 'Canchas' });
});

module.exports = { Empresa };
