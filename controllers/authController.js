const { loginUsuario } = require('../services/authService');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("aqui ingresa al ednpoint api-login");
  try {
    const token = await loginUsuario(email, password);
    res.json({ token });
  } catch (error) {
    console.log("aqui falla", error);
    res.status(400).json({ message: error.message });
  }
};