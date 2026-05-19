import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './CrearEvaluacion.css';

const CrearEvaluacion = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isTeacher } = useAuth();
  const [modulos, setModulos] = useState([]);
  const [formValues, setFormValues] = useState({
    titulo: '',
    descripcion: '',
    modulo: '',
    tiempoLimitado: false,
    tiempoMinutos: 5
  });

  const [preguntas, setPreguntas] = useState([
    {
      id: 1,
      enunciado: '',
      opciones: { A: '', B: '', C: '', D: '' },
      respuestaCorrecta: ''
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isTeacher) {
      navigate('/evaluaciones');
      return;
    }

    // Cargar módulos para mostrar en las tarjetas
    api.get('/contenidos/modulos')
      .then(res => setModulos(res.data?.data || []))
      .catch(() => setModulos([]));
  }, [isAuthenticated, isTeacher, navigate]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePreguntaChange = (id, field, value) => {
    setPreguntas((prev) =>
      prev.map((pregunta) =>
        pregunta.id === id
          ? field === 'opciones'
            ? { ...pregunta, opciones: { ...pregunta.opciones, ...value } }
            : { ...pregunta, [field]: value }
          : pregunta
      )
    );
  };

  const agregarPregunta = () => {
    const nuevaPregunta = {
      id: preguntas.length + 1,
      enunciado: '',
      opciones: { A: '', B: '', C: '', D: '' },
      respuestaCorrecta: ''
    };
    setPreguntas((prev) => [...prev, nuevaPregunta]);
  };

  const eliminarPregunta = (id) => {
    if (preguntas.length > 1) {
      setPreguntas((prev) => prev.filter((pregunta) => pregunta.id !== id));
    }
  };

  const validarFormulario = () => {
    if (!formValues.titulo.trim()) {
      setError('El título es obligatorio.');
      return false;
    }

    if (!formValues.modulo.trim()) {
      setError('El módulo es obligatorio.');
      return false;
    }

    for (let i = 0; i < preguntas.length; i++) {
      const pregunta = preguntas[i];
      if (!pregunta.enunciado.trim()) {
        setError(`La pregunta ${i + 1} necesita un enunciado.`);
        return false;
      }

      if (!pregunta.opciones.A.trim() || !pregunta.opciones.B.trim() ||
          !pregunta.opciones.C.trim() || !pregunta.opciones.D.trim()) {
        setError(`La pregunta ${i + 1} necesita todas las opciones (A, B, C, D).`);
        return false;
      }

      if (!pregunta.respuestaCorrecta) {
        setError(`La pregunta ${i + 1} necesita una respuesta correcta.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      const evaluacionData = {
        ...formValues,
        docente_id: user.id,
        preguntas: preguntas.map(({ id, ...rest }) => rest) // Remover id temporal
      };

      console.log('📤 Enviando datos:', JSON.stringify(evaluacionData, null, 2));

      const response = await api.post('/evaluaciones', evaluacionData);

      setSuccess('Evaluación creada exitosamente.');
      setTimeout(() => {
        navigate('/evaluaciones');
      }, 800);
    } catch (err) {
      console.error('Error al crear evaluación:', err);
      setError(err.response?.data?.message || 'Error al crear la evaluación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-evaluacion-container">
      <button className="volver-btn" onClick={() => navigate(-1)}>
        ← Volver a Evaluaciones
      </button>

      <div className="crear-evaluacion-header">
        <h2>Crear Nueva Evaluación</h2>
      </div>

      

        <div className="form-section">
          <h3>Información General</h3>

          <div className="form-group">
            <label htmlFor="titulo">Título *</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formValues.titulo}
              onChange={handleChange}
              placeholder="Ej: Evaluación de Matemáticas Básicas"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formValues.descripcion}
              onChange={handleChange}
              placeholder="Describe brevemente el contenido de la evaluación"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="modulo">Módulo *</label>
            {modulos.length > 0 ? (
            <select
              type="text"
              id="modulo"
              name="modulo"
              value={formValues.modulo}
              onChange={handleChange}
              required
            >
              <option value="">-- Selecciona un módulo --</option>
                    {modulos.map((m) => (
                      <option key={m.id} value={m.modulo}>{m.modulo} – {m.titulo}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    id="modulo"
                    name="modulo"
                    value={formValues.modulo}
                    onChange={handleChange}
                    placeholder="Ej: Matemáticas (no hay módulos creados)"
                    required
                  />
                )}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="tiempoLimitado"
                checked={formValues.tiempoLimitado}
                onChange={handleChange}
              />
              <span>Evaluación con tiempo limitado</span>
            </label>
          </div>

          {formValues.tiempoLimitado && (
            <div className="form-group">
              <label htmlFor="tiempoMinutos">Tiempo límite (minutos)</label>
              <select
                id="tiempoMinutos"
                name="tiempoMinutos"
                value={formValues.tiempoMinutos}
                onChange={handleChange}
              >
                <option value={5}>5 minutos</option>
                <option value={10}>10 minutos</option>
                <option value={15}>15 minutos</option>
                <option value={20}>20 minutos</option>
                <option value={25}>25 minutos</option>
                <option value={30}>30 minutos</option>
              </select>
            </div>
          )}
        </div>

        <div className="form-section">
          <div className="preguntas-header">
            <h3>Preguntas</h3>
            <button type="button" onClick={agregarPregunta} className="agregar-pregunta-btn">
              + Agregar Pregunta
            </button>
          </div>

          {preguntas.map((pregunta, index) => (
            <div key={pregunta.id} className="pregunta-card">
              <div className="pregunta-header">
                <h4>Pregunta {index + 1}</h4>
                {preguntas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarPregunta(pregunta.id)}
                    className="eliminar-pregunta-btn"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>Enunciado *</label>
                <textarea
                  value={pregunta.enunciado}
                  onChange={(e) => handlePreguntaChange(pregunta.id, 'enunciado', e.target.value)}
                  placeholder="Escribe la pregunta aquí"
                  rows="2"
                  required
                />
              </div>

              <div className="opciones-grid">
                {['A', 'B', 'C', 'D'].map((letra) => (
                  <div key={letra} className="form-group">
                    <label>Opción {letra} *</label>
                    <input
                      type="text"
                      value={pregunta.opciones[letra]}
                      onChange={(e) => handlePreguntaChange(pregunta.id, 'opciones', { [letra]: e.target.value })}
                      placeholder={`Opción ${letra}`}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Respuesta Correcta *</label>
                <select
                  value={pregunta.respuestaCorrecta}
                  onChange={(e) => handlePreguntaChange(pregunta.id, 'respuestaCorrecta', e.target.value)}
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="crear-evaluacion-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creando...' : 'Crear Evaluación'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearEvaluacion;