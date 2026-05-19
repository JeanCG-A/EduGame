const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretoeduapp123';

const registerUser = async (userData) => {
  const { name, email, password, role } = userData;

  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('El correo ya está registrado');
  }

  // Encriptar la contraseña (hash)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Crear el usuario en la BD
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  return newUser;
};

const loginUser = async (email, password) => {
  // Buscar al usuario
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  // Verificar contraseña
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  // Generar Token JWT
  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' } // El token expira en 24 horas
  );

  return { user, token };
};

module.exports = {
  registerUser,
  loginUser
};
