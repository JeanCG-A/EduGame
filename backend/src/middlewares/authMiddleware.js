const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretoeduapp123';

const verifyToken = (req, res, next) => {
  // El token generalmente viene en el header 'Authorization: Bearer <token>'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Guardamos los datos del usuario en la request (ej. req.user.id)
    next(); // Permite que la petición continúe a la siguiente función
  } catch (error) {
    return res.status(403).json({ status: 'error', message: 'Token inválido o expirado' });
  }
};

// Middleware opcional para verificar si es profesor
const isTeacher = (req, res, next) => {
  const role = req.user && req.user.role;
  if (role === 'teacher' || role === 'docente') {
    next();
  } else {
    return res.status(403).json({ status: 'error', message: 'Se requiere rol de profesor para esta acción.' });
  }
};

// Middleware para verificar si es estudiante
const isStudent = (req, res, next) => {
  const role = req.user && req.user.role;
  if (role === 'student' || role === 'estudiante') {
    next();
  } else {
    return res.status(403).json({ status: 'error', message: 'Se requiere rol de estudiante para esta acción.' });
  }
};

module.exports = {
  verifyToken,
  isTeacher,
  isStudent
};
