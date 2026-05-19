const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validación básica
    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
    }

    const newUser = await authService.registerUser({ name, email, password, role });

    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado exitosamente',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    // Pasar al middleware de manejo de errores
    if (error.message === 'El correo ya está registrado') {
      return res.status(400).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Faltan correo o contraseña' });
    }

    const { user, token } = await authService.loginUser(email, password);

    res.status(200).json({
      status: 'success',
      message: 'Login exitoso',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    if (error.message === 'Credenciales inválidas') {
      return res.status(401).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

module.exports = {
  register,
  login
};
