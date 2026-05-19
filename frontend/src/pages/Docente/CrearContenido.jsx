import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './CrearContenido.css';


const CrearContenido = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isTeacher } = useAuth();
  const [formValues, setFormValues] = useState({
    titulo: '',
    descripcion: '',
    tipo: '',
    contenido: '',
    modulo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isTeacher) {
      navigate('/contenidos');
      return;
    }
  }, [isAuthenticated, isTeacher, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!formValues.titulo || !formValues.tipo || !formValues.contenido || !formValues.modulo) {
      setError('Completa todos los campos obligatorios.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/contenidos', {
        ...formValues,
        docente_id: user?.id
      });

      setSuccess('Contenido creado exitosamente.');
      setFormValues({ titulo: '',  tipo: '', contenido: '', modulo: '' });
      setTimeout(() => {
        navigate('/contenidos');
      }, 800);
    } catch (err) {
      console.error('Error al crear contenido:', err);
      setError(err.response?.data?.message || 'Error al crear el contenido. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="detalle-container">
      <button className="detalle-back" onClick={() => navigate('/contenidos')}>
        ← Volver
      </button>
      
    <div className="crear-contenido-container">
      <div className="crear-contenido-card">
        <h2>Crear nuevo contenido</h2>

        <form onSubmit={handleSubmit} className="crear-contenido-form">
          <label>
            Título
            <input
              type="text"
              name="titulo"
              value={formValues.titulo}
              onChange={handleChange}
              placeholder="Título del contenido"
              required
            />
          </label>

          <label>
            Informacion del contenido
            <textarea
              name="descripcion"
              value={formValues.descripcion}
              onChange={handleChange}
              placeholder="Informacion completa del contenido (opcional)"
              rows="4"
            />
          </label>

          <label>
            Tipo de trabajo o contenido
            <select name="tipo" value={formValues.tipo} onChange={handleChange} required>
              <option value="">Selecciona un tipo</option>
              <option value="video">Video</option>
              <option value="pdf">Imagen</option>
              <option value="texto">Texto</option>
            </select>
          </label>

          <label>
            Apoyo Extra para el contenido
            <textarea
              name="contenido"
              value={formValues.contenido}
              onChange={handleChange}
              placeholder="Texto o URL del contenido"
              rows="5"
              required
            />
          </label>

          <label>
            Módulo
            <input
              type="text"
              name="modulo"
              value={formValues.modulo}
              onChange={handleChange}
              placeholder="Nombre del módulo"
              required
            />
          </label>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Guardando...' : 'Crear contenido'}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default CrearContenido;
