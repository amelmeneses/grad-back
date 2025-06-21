// backend/models/userModel.js

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");
const { Role } = require("./roleModel");

class Usuario extends Sequelize.Model {}

Usuario.init(
  {
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
        model: "roles",
        key: "id",
      },
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // 1 = activo, 0 = inactivo
    },
    activation_token: {
      type: DataTypes.STRING(255),
      allowNull: true, // al crear anónimo generaremos uno
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: false,
  }
);

// Relación: Usuario pertenece a un Role
Usuario.belongsTo(Role, { foreignKey: "rol_id", as: "Role" });

// Hook para hashear la contraseña en CREATE
Usuario.beforeCreate(async (usuario) => {
  const salt = await bcrypt.genSalt(10);
  usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
});

// Hook para hashear la contraseña en UPDATE (solo si cambia)
Usuario.beforeUpdate(async (usuario) => {
  if (usuario.changed("contrasena")) {
    const salt = await bcrypt.genSalt(10);
    usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
  }
});

module.exports = { Usuario };
