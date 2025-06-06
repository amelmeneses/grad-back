// backend/models/facturacionModel.js

const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const { Usuario } = require('./userModel');

class Facturacion extends Model {}

Facturacion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_facturador: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cedula_o_ruc: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    correo_electronico: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Facturacion',
    tableName: 'facturacion',
    timestamps: false,
  }
);

// Relación Facturación → Usuario (muchos registros de facturación por usuario)
Facturacion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'Usuario' });

module.exports = { Facturacion };
