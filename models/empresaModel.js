// backend/models/empresaModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { Usuario } = require('./userModel');
const Cancha = require('./canchaModel'); // Importamos la clase Cancha

// Definición del modelo Empresa
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

// Asociaciones
Empresa.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'Usuario' });
Usuario.hasMany(Empresa, { foreignKey: 'usuario_id', as: 'Empresas' });

// Asociación 1:N Empresa → Cancha
Empresa.hasMany(Cancha, { foreignKey: 'empresa_id', as: 'courts' });

module.exports = { Empresa };
