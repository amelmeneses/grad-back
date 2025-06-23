const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Añadimos la información del usuario decodificado a la solicitud
    next();
  } catch (error) {
    return res.status(400).send({ message: 'Invalid token.' });
  }
};

// Middleware para verificar si el usuario es admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 1 && req.user.role !== 3) { // Suponiendo que el rol 1 es Admin
    return res.status(403).send({ message: 'Access denied. Admins only.' });
  }
  next();
};
