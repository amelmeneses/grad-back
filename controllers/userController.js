// backend/controllers/userController.js

const { sendMail } = require('../utils/mailer');

const {
  registrarNuevoUsuario,
  registrarNuevoUsuarioAnonimo,
  activateUserByToken,
  getAllUsuarios,
  getUsuarioById,
  updateUsuarioById,
  deleteUsuarioById,
  cambiarEstadoUsuario
} = require('../services/userService');

exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol_id, estado } = req.body;
    const user = await registrarNuevoUsuario({ nombre, apellido, email, password, rol_id, estado });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Registro de usuario anónimo:
 * crea con estado 0 e
 * envía link de activación por email.
 */
exports.registerAnonUser = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;
    const user = await registrarNuevoUsuarioAnonimo({ nombre, apellido, email, password });

    const activationLink = `${process.env.APP_URL}/activate/${user.activation_token}`;
    const html = `
      <p>Hola ${user.nombre},</p>
      <p>Pulsa este enlace para activar tu cuenta:</p>
      <a href="${activationLink}">Activar mi cuenta</a>
    `;

    // kick off mail but don't await it
    sendMail(user.email, 'Activa tu cuenta', html)
      .then(previewUrl => {
        if (previewUrl) console.log('Activation email preview:', previewUrl);
      })
      .catch(err => console.error('Error sending activation mail:', err));

    res.status(201).json({
      message: 'Usuario creado. Revisa tu correo para activarlo.',
      // in dev there's no URL, but you can find it in stdout
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.activateAnonUser = async (req, res) => {
  try {
    await activateUserByToken(req.params.token);
    // puedes redirigir a tu front o mostrar un mensaje html
    return res.send(`
      <h1>Cuenta activada correctamente 🎉</h1>
      <p>Ya puedes <a href="/login">iniciar sesión</a>.</p>
    `);
  } catch (err) {
    return res.status(err.status || 500).send(`
      <h1>Error al activar cuenta</h1>
      <p>${err.message}</p>
    `);
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.obtenerUsuario = async (req, res) => {
  try {
    const usuario = await getUsuarioById(req.params.id);
    res.json(usuario);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, contrasena, rol_id, estado } = req.body;
    const usuario = await updateUsuarioById(
      req.params.id,
      { nombre, apellido, email, contrasena, rol_id, estado }
    );
    res.json(usuario);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.eliminarUsuario = async (req, res, next) => {
  try {
    await deleteUsuarioById(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

exports.desactivarUsuario = async (req, res) => {
  try {
    await cambiarEstadoUsuario(req.params.id, 0);
    res.json({ message: 'Usuario desactivado.' });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.activarUsuario = async (req, res) => {
  try {
    await cambiarEstadoUsuario(req.params.id, 1);
    res.json({ message: 'Usuario activado.' });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};