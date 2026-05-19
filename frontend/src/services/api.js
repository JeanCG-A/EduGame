import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Modificar si el backend usa otro puerto
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para inyectar automáticamente el JWT en cada petición
api.interceptors.request.use(
  (config) => {
    // Obtenemos el token desde localStorage
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas (opcional, ej. para desloguear si el token expira)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Lógica para cerrar sesión o redirigir al login
      console.warn('Acceso denegado o sesión expirada');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
