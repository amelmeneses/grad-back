const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // Import sequelize instance
const bcrypt = require('bcryptjs');
const { Role } = require('./roleModel');  // Import the Role model

class Usuario extends Sequelize.Model {}

Usuario.init({
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
      model: 'roles',  // Reference to the 'roles' table
      key: 'id',
    },
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,  // Pass the sequelize instance here
  modelName: 'Usuario',  // Define model as 'Usuario'
  tableName: 'usuarios',  // Map to 'usuarios' table
  timestamps: false,
});

// Define relationship between Usuario and Role
Usuario.belongsTo(Role, { foreignKey: 'rol_id', as: 'Role' });

Usuario.beforeCreate(async (usuario) => {
  const salt = await bcrypt.genSalt(10);
  usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
});

Usuario.beforeUpdate(async (usuario) => {
  if (usuario.contrasena && usuario.contrasena !== "") {
    const salt = await bcrypt.genSalt(10);
    usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
  }
});

module.exports = { Usuario };
