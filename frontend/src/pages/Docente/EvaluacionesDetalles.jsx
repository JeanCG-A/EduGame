import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './EvaluacionesDetalles.css';

const EvaluacionesDetalles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isTeacher } = useAuth();
  const [modulos, setModulos] = useState([]);
  const isEditMode = location.pathname.endsWith('/editar');

  const [evaluacion, setEvaluacion] = useState(null);
  const [formValues, setFormValues] = useState({
    titulo: '',
    descripcion: '',
    modulo: '',
    tiempoLimitado: false,
    tiempoMinutos: 5
  });
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchEvaluacion = async () => {
      try {
        // Cargar módulos para mostrar en las tarjetas
        const modulosResponse = await api.get('/contenidos/modulos');
        setModulos(modulosResponse.data?.data || []);

        const response = await api.get(`/evaluaciones/${id}`);
        const data = response.data?.data || null;

        if (!data) {
          setError('Evaluación no encontrada.');
          return;
        }

        setEvaluacion(data);
        setFormValues({
          titulo: data.titulo || '',
          descripcion: data.descripcion || '',
          modulo: data.modulo || '',
          tiempoLimitado: !!data.tiempoLimitado,
          tiempoMinutos: data.tiempoMinutos || 5
        });

        setPreguntas(
          data.preguntas?.map((pregunta) => ({
            id: pregunta.id || pregunta._id, 
            enunciado: pregunta.pregunta,
            opciones: {
              A: pregunta.opcion_a || '',
              B: pregunta.opcion_b || '',
              C: pregunta.opcion_c || '',
              D: pregunta.opcion_d || ''
            },
            respuestaCorrecta: pregunta.respuesta_correcta?.toUpperCase() || ''
          })) || []
        );
      } catch (err) {
        console.error('Error al cargar la evaluación:', err);
        setError('No se pudo cargar la evaluación. Verifica el ID o la conexión.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvaluacion();
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePreguntaChange = (questionId, field, value) => {
    setPreguntas((prev) =>
      prev.map((pregunta) =>
        pregunta.id === questionId
          ? field === 'opciones'
            ? { ...pregunta, opciones: { ...pregunta.opciones, ...value } }
            : { ...pregunta, [field]: value }
          : pregunta
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!formValues.titulo.trim() || !formValues.modulo.trim()) {
      setError('Título y módulo son obligatorios.');
      return;
    }

    const preguntasValidas = preguntas.every((pregunta) => {
      return (
        pregunta.enunciado.trim() &&
        pregunta.opciones.A.trim() &&
        pregunta.opciones.B.trim() &&
        pregunta.opciones.C.trim() &&
        pregunta.opciones.D.trim() &&
        pregunta.respuestaCorrecta
      );
    });

    if (!preguntasValidas) {
      setError('Completa todas las preguntas antes de guardar.');
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        ...formValues,
        preguntas: preguntas.map(({ id: preguntaId, enunciado, opciones, respuestaCorrecta }) => ({
          id: preguntaId,
          enunciado,
          opciones,
          respuestaCorrecta
        }))
      };

      console.log('Enviando PUT /evaluaciones/', id, updateData);
      const response = await api.put(`/evaluaciones/${id}`, updateData);
      setEvaluacion(response.data?.data || response.data);
      setSuccess('Evaluación actualizada correctamente.');
      setTimeout(() => {
        navigate('/evaluaciones');
      }, 900);
    } catch (err) {
      console.error('Error al actualizar evaluación:', err);
      console.error('Respuesta del servidor:', err.response?.status, err.response?.data);
      setError(err.response?.data?.message || err.message || 'Error al actualizar la evaluación.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="detalle-mensaje">Cargando evaluación...</div>;
  }

  if (error) {
    return <div className="detalle-mensaje error">{error}</div>;
  }

  if (!evaluacion) {
    return <div className="detalle-mensaje">Evaluación no encontrada.</div>;
  }

  return (
    <div className="detalle-container">
      <button className="detalle-back" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      {isEditMode && isTeacher ? (
        <form className="detalle-card" onSubmit={handleSubmit}>
          {error && <div className="detalle-mensaje error">{error}</div>}
          {success && <div className="detalle-mensaje success">{success}</div>}

          <h2 className="detalle-titulo">Editar Evaluación</h2>

          <label>
            Título
            <input
              name="titulo"
              value={formValues.titulo}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Descripción
            <textarea
              name="descripcion"
              value={formValues.descripcion}
              onChange={handleChange}
              rows={3}
            />
          </label>

          <label>Módulo *</label>
          {modulos.length > 0 ? (
            <select
              name="modulo"
              value={formValues.modulo}
              onChange={handleChange}
              required
            >
              <option value="">-- Selecciona un módulo --</option>
              {modulos.map((m) => (
                <option key={m.id} value={m.modulo}>
                  {m.modulo} – {m.titulo}
                </option>
              ))}
            </select>
          ) : (
            <input
              name="modulo"
              value={formValues.modulo}
              onChange={handleChange}
              required
            />
          )}

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="tiempoLimitado"
              checked={formValues.tiempoLimitado}
              onChange={handleChange}
            />
            Evaluación con tiempo limitado
          </label>

          {formValues.tiempoLimitado && (
            <label>
              Tiempo límite (minutos)
              <select
                name="tiempoMinutos"
                value={formValues.tiempoMinutos}
                onChange={handleChange}
              >
                {[5, 10, 15, 20, 25, 30].map((min) => (
                  <option key={min} value={min}>
                    {min} minutos
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="detalle-body">
            <h3>Preguntas</h3>
            {preguntas.map((pregunta, index) => (
              <div key={pregunta.id} className="pregunta-card">
                <h4>Pregunta {index + 1}</h4>

              <div className="form-group">
                <label>
                  Enunciado
                  <textarea
                    value={pregunta.enunciado}
                    onChange={(e) => handlePreguntaChange(pregunta.id, 'enunciado', e.target.value)}
                    rows={2}
                    required
                  />
                </label>

                </div>

                <div className="opciones-grid">
                  {['A', 'B', 'C', 'D'].map((letra) => (
                    <label key={letra}>
                      Opción {letra}
                      <input
                        value={pregunta.opciones[letra]}
                        onChange={(e) =>
                          handlePreguntaChange(pregunta.id, 'opciones', { [letra]: e.target.value })
                        }
                        required
                      />
                    </label>
                  ))}
                </div>

                <label>
                  Respuesta correcta
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
                </label>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      ) : (
        <div className="detalle-card">
          <h2 className="detalle-titulo">{evaluacion.titulo}</h2>

          <div className="detalle-meta">
            <span className="badge modulo">Módulo {evaluacion.modulo}</span>
            {evaluacion.tiempoLimitado ? (
              <span className="badge tipo">Tiempo: {evaluacion.tiempoMinutos} min</span>
            ) : (
              <span className="badge tipo">Sin límite de tiempo</span>
            )}
          </div>

          {evaluacion.descripcion && (
            <p className="detalle-descripcion">{evaluacion.descripcion}</p>
          )}

          <div className="detalle-body">
            <h3>Preguntas</h3>
            {evaluacion.preguntas?.map((pregunta, index) => (
              <div key={pregunta.id || pregunta._id} className="pregunta-card">
                <h4>{index + 1}. {pregunta.pregunta}</h4>
                <ul>
                  <li>A: {pregunta.opcion_a}</li>
                  <li>B: {pregunta.opcion_b}</li>
                  <li>C: {pregunta.opcion_c}</li>
                  <li>D: {pregunta.opcion_d}</li>
                </ul>
                <p>Correcta: {pregunta.respuesta_correcta?.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluacionesDetalles;