import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './RegisterDocente.css';

const RegisterDocente = () => {
  // Inicializamos en 'docente' porque según tus reglas, el estudiante no puede auto-registrarse
  const [role, setRole] = useState('docente');
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }

    // Bloqueo de seguridad en frontend cumpliendo tu regla de negocio
    if (role === 'estudiante') {
      return setError('Acción denegada: Los estudiantes deben ser registrados por su docente.');
    }

    setIsLoading(true);

    try {
      // Ajustar ruta según tu backend
      const response = await api.post('/auth/register', {
        name: formData.nombre,
        username: formData.usuario,
        email: formData.email,
        password: formData.password,
        role: 'teacher' // Siempre registramos como docente desde esta vista pública
      });

      if (response.data) {
        // Redirigir al login tras un registro exitoso
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la cuenta. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">


      <div className="register-card">

        <div className="register-header">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <h1>Crear una Cuenta para poder trabajar en la plataforma Profesor</h1>

          <p>Únete a EduGame Platform</p>

          <div className="info-message-external">
            👋 <strong>¡Hola estudiante!</strong><br />
            Solo tu profesor puede crear tu cuenta, cuando lo haga podras ingresar a la plataforma.
          </div>
        </div>


        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label>Nombre Completo</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                name="nombre"
                placeholder="Ingresa tu nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                required
                disabled={role === 'estudiante'}
              />
            </div>
          </div>


          <div className="form-group">
            <label>Email o Correo</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={role === 'estudiante'}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                name="password"
                placeholder="Mínimo 6 caracteres o letras"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={role === 'estudiante'}
                minLength={6}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={role === 'estudiante'}
              />
            </div>
          </div>

          <button type="submit" className="register-btn" disabled={isLoading || role === 'estudiante'}>
            {isLoading ? 'Creando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="register-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterDocente;
