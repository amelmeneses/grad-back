const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // Importamos la configuración de Sequelize
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  contrasena: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Roles',  // Hace referencia a la tabla de Roles
      key: 'id',
    },
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Antes de crear o actualizar un usuario, encriptamos la contraseña
Usuario.beforeCreate(async (usuario) => {
  const salt = await bcrypt.genSalt(10);
  usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
});

// Antes de actualizar un usuario, encriptamos la nueva contraseña
Usuario.beforeUpdate(async (usuario) => {
  if (usuario.contrasena && usuario.contrasena !== "") {
    const salt = await bcrypt.genSalt(10);
    usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
  }
});

module.exports = { Usuario };
