// backend/models/empresaModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { Usuario } = require('./userModel');

const Empresa = sequelize.define('Empresa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contacto_email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contacto_telefono: {
    type: DataTypes.STRING,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Usuario, key: 'id' }
  }
}, {
  tableName: 'empresas',
  timestamps: false
});

// Relación Empresa → Usuario (owner)
Empresa.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'Usuario' });
// Relación Usuario → Empresas (1:N)
Usuario.hasMany(Empresa, { foreignKey: 'usuario_id', as: 'Empresas' });

module.exports = { Empresa };
