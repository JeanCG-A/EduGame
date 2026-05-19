import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { MdArrowBack, MdCheckCircle, MdError, MdStars, MdAccessTime, MdQuiz } from 'react-icons/md';
import Swal from 'sweetalert2';
import './Student.css';

const StudentEvaluacionResolver = () => {
  const { id } = useParams();
  const [evaluacion, setEvaluacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(null);
  const [iniciado, setIniciado] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    api.get(`/evaluaciones/${id}`)
      .then(res => {
        const data = res.data.data;
        if (!data || !data.preguntas) setError('Esta evaluación no tiene preguntas configuradas.');
        else setEvaluacion(data);
      })
      .catch(err => setError(err.response?.data?.message || 'Error al cargar la evaluación.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (iniciado && evaluacion?.tiempoLimitado && evaluacion?.tiempoMinutos) {
      const totalSeg = evaluacion.tiempoMinutos * 60;
      setTiempoRestante(totalSeg);
      intervalRef.current = setInterval(() => {
        setTiempoRestante(prev => {
          if (prev <= 1) { clearInterval(intervalRef.current); handleSubmit(true); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [iniciado, evaluacion]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleSubmit = async (auto = false) => {
    setEnviando(true);
    try {
      const respuestasArray = Object.entries(respuestas).map(([pid, r]) => ({ pregunta_id: Number(pid), respuesta: r }));
      const res = await api.post(`/student/evaluaciones/${id}/responder`, { respuestas: respuestasArray });
      setResultado(res.data.data);
      if (!auto) {
        Swal.fire({ icon: res.data.data.puntaje >= 60 ? 'success' : 'info', title: res.data.data.puntaje >= 60 ? '¡Excelente!' : 'Sigue practicando', text: res.data.message, confirmButtonColor: '#7c3aed' });
      }
    } catch (err) {
      if (!auto) Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Error al enviar respuestas' });
    } finally { setEnviando(false); }
  };

  if (loading) return <div className="student-loading"><div className="spinner"></div><p>Cargando evaluación...</p></div>;
  if (error) return <div className="student-page"><div className="empty-state"><h3>{error}</h3></div></div>;

  if (!iniciado && !resultado) {
    return (
      <div className="student-page">
        <Link to="/student/evaluaciones" className="btn-back"><MdArrowBack /> Volver a Evaluaciones</Link>
        <div className="evaluacion-start-card">
          <MdQuiz className="start-icon" />
          <h1>{evaluacion.titulo}</h1>
          <p>{evaluacion.descripcion}</p>
          <div className="start-info">
            <span><strong>Módulo:</strong> {evaluacion.modulo}</span>
            {evaluacion.tiempoLimitado && evaluacion.tiempoMinutos && <span><strong>Tiempo límite:</strong> {evaluacion.tiempoMinutos} minutos</span>}
            <span><strong>Preguntas:</strong> {evaluacion.preguntas?.length || 0}</span>
          </div>
          <button className="btn-iniciar" onClick={() => setIniciado(true)}><MdAccessTime /> Comenzar Evaluación</button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-page">
      <div className="evaluacion-resolver-header">
        <div className="resolver-info">
          <h1>{evaluacion.titulo}</h1>
          <span className="modulo-badge">{evaluacion.modulo}</span>
        </div>
        {tiempoRestante !== null && (
          <div className={`tiempo-restante ${tiempoRestante < 60 ? 'tiempo-critico' : ''}`}>
            <MdAccessTime /> {formatTime(tiempoRestante)}
          </div>
        )}
      </div>

      {!resultado ? (
        <>
          <div className="preguntas-list">
            {(evaluacion.preguntas || []).map((p, idx) => (
              <div key={p.id} className="pregunta-card">
                <div className="pregunta-numero">Pregunta {idx + 1}</div>
                <p className="pregunta-enunciado">{p.pregunta}</p>
                <div className="opciones-grid">
                  {[{ l: 'a', t: p.opcion_a }, { l: 'b', t: p.opcion_b }, { l: 'c', t: p.opcion_c }, { l: 'd', t: p.opcion_d }].filter(o => o.t).map(o => (
                    <label key={o.l} className={`opcion-label ${respuestas[p.id] === o.l ? 'selected' : ''}`}>
                      <input type="radio" name={`p_${p.id}`} value={o.l} onChange={() => setRespuestas({ ...respuestas, [p.id]: o.l })} />
                      <span className="opcion-letra">{o.l.toUpperCase()}.</span>
                      <span className="opcion-texto">{o.t}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="evaluacion-actions">
            <span className="respuestas-count">Respondidas: {Object.keys(respuestas).length} / {evaluacion.preguntas?.length || 0}</span>
            <button className="btn-enviar" onClick={() => handleSubmit(false)} disabled={enviando || Object.keys(respuestas).length === 0}>
              {enviando ? 'Enviando...' : <><MdStars /> Enviar Respuestas</>}
            </button>
          </div>
        </>
      ) : (
        <div className="resultado-card">
          <div className="resultado-icono">{resultado.puntaje >= 60 ? <MdCheckCircle style={{ color: '#059669' }} /> : <MdError style={{ color: '#dc2626' }} />}</div>
          <h3>{resultado.puntaje >= 60 ? '¡Excelente trabajo!' : 'Sigue practicando'}</h3>
          <div className="resultado-puntaje"><MdStars /> Puntaje: {resultado.puntaje}/100</div>
          <div className="resultado-detalle">
            <p>Respuestas correctas: {resultado.respuestas_correctas} de {resultado.total_preguntas}</p>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${resultado.puntaje}%` }}><span>{resultado.puntaje}%</span></div>
            </div>
          </div>
          {resultado.detalle && (
            <div className="resultado-preguntas">
              <h4>Detalle por pregunta:</h4>
              {(evaluacion.preguntas || []).map((p, i) => {
                const d = resultado.detalle.find(dt => dt.pregunta_id === p.id);
                return (
                  <div key={p.id} className={`detalle-item ${d?.es_correcta ? 'correcta' : 'incorrecta'}`}>
                    <div className="detalle-item-header">
                      <span className="detalle-numero">P{i + 1}</span>
                      {d?.es_correcta ? <MdCheckCircle className="detalle-icono correcto" /> : <MdError className="detalle-icono incorrecto" />}
                    </div>
                    <p className="detalle-pregunta">{p.pregunta}</p>
                    <p className="detalle-respuesta">Tu respuesta: <strong>{d?.respuesta_enviada?.toUpperCase() || 'No respondida'}</strong>
                      {!d?.es_correcta && <> | Correcta: <strong className="texto-correcto">{d?.respuesta_correcta?.toUpperCase()}</strong></>}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          <Link to="/student/evaluaciones" className="btn-volver-jugar">← Volver a Evaluaciones</Link>
        </div>
      )}
    </div>
  );
};

export default StudentEvaluacionResolver;
