const { registrarNuevoUsuario } = require('../services/userService');

exports.registrarUsuario = async (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  try {
    const nuevoUsuario = await registrarNuevoUsuario({ nombre, apellido, email, password });
    res.status(201).json({ message: 'Usuario creado exitosamente', user: nuevoUsuario });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const { getAllUsuarios } = require('../services/userService');
// Listar todos los usuarios
// Esta función se encarga de obtener todos los usuarios de la base de datos
// y devolverlos en formato JSON.
// Se utiliza en la ruta '/users' para mostrar todos los usuarios registrados
// en la aplicación.


// exports.listarUsuarios = async (req, res) => {
//   try {
//     const usuarios = await getAllUsuarios();
//     res.json(usuarios);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };