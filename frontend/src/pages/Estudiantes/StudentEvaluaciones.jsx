import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { MdAssignment, MdPlayArrow, MdAccessTime, MdCheckCircle } from 'react-icons/md';
import './Student.css';

const StudentEvaluaciones = () => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [completados, setCompletados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/evaluaciones/publicadas')
      .then(res => setEvaluaciones(res.data.data || []))
      .catch(err => console.error('Error al cargar evaluaciones:', err))
      .finally(() => setLoading(false));

    api.get('/student/completados')
      .then(res => setCompletados(res.data.data?.evaluaciones || []))
      .catch(() => {});
  }, []);

  if (loading) return <div className="student-loading"><div className="spinner"></div><p>Cargando evaluaciones...</p></div>;

  return (
    <div className="student-page">
      <div className="page-header">
        <h1><MdAssignment /> Mis Evaluaciones</h1>
        <p>Demuestra lo que has aprendido resolviendo las evaluaciones</p>
      </div>

      {evaluaciones.length === 0 ? (
        <div className="empty-state">
          <MdAssignment className="empty-icon" />
          <h3>No hay evaluaciones pendientes</h3>
          <p>El docente aún no ha publicado evaluaciones.</p>
        </div>
      ) : (
        <div className="catalog-grid">
          {evaluaciones.map(e => {
            const completado = completados.includes(e.id);
            return (
              <Link key={e.id} to={`/student/evaluaciones/${e.id}`} className="catalog-card"
                style={{ borderTop: `4px solid ${completado ? '#059669' : '#7c3aed'}` }}>
                <div className="catalog-card-header">
                  <div className="catalog-icon" style={{ background: completado ? '#ecfdf5' : '#f3e8ff', color: completado ? '#059669' : '#7c3aed' }}>
                    📝
                  </div>
                  <span className="modulo-badge">{e.modulo}</span>
                </div>
                <h3>{e.titulo}</h3>
                <p>{e.descripcion}</p>
                <div style={{ marginBottom: '0.5rem' }}>
                  {e.tiempoLimitado && e.tiempoMinutos && (
                    <span className="tiempo-badge"><MdAccessTime /> {e.tiempoMinutos} min</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto' }}>
                  <span className="catalog-btn"><MdPlayArrow /> {completado ? 'Intentar de nuevo' : 'Resolver Evaluación'}</span>
                  {completado && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#059669', fontWeight: 600, fontSize: '0.8rem' }}>
                      <MdCheckCircle /> Completado
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentEvaluaciones;
