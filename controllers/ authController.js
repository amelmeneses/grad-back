const { loginUsuario } = require('../services/authService');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await loginUsuario(email, password);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
