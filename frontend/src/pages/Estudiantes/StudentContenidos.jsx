import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { MdMenuBook, MdVisibility, MdCheckCircle } from 'react-icons/md';
import './Student.css';

const tipoIconos = { video: '🎬', pdf: '📄', enlace: '🔗', texto: '📝' };

const StudentContenidos = () => {
  const [contenidos, setContenidos] = useState([]);
  const [completados, setCompletados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/contenidos/publicados')
      .then(res => setContenidos(res.data.data || []))
      .catch(err => console.error('Error al cargar contenidos:', err))
      .finally(() => setLoading(false));

    api.get('/student/completados')
      .then(res => setCompletados(res.data.data?.contenidos || []))
      .catch(() => {});
  }, []);

  if (loading) return <div className="student-loading"><div className="spinner"></div><p>Cargando contenidos...</p></div>;

  return (
    <div className="student-page">
      <div className="page-header">
        <h1><MdMenuBook /> Mis Clases</h1>
        <p>Explora los materiales educativos creados para ti</p>
      </div>

      {contenidos.length === 0 ? (
        <div className="empty-state">
          <MdMenuBook className="empty-icon" />
          <h3>No hay contenidos disponibles</h3>
          <p>El docente aún no ha publicado contenidos educativos.</p>
        </div>
      ) : (
        <div className="catalog-grid">
          {contenidos.map(c => {
            const visto = completados.includes(c.id);
            return (
              <Link key={c.id} to={`/student/contenidos/${c.id}`} className="catalog-card"
                style={{ borderTop: `4px solid ${visto ? '#059669' : '#4f46e5'}` }}>
                <div className="catalog-card-header">
                  <div className="catalog-icon" style={{ background: visto ? '#ecfdf5' : '#eef2ff', color: visto ? '#059669' : '#4f46e5' }}>
                    {tipoIconos[c.tipo] || '📝'}
                  </div>
                  <span className="modulo-badge">{c.modulo}</span>
                </div>
                <h3>{c.titulo}</h3>
                <p>{c.descripcion}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto' }}>
                  <span className="catalog-btn"><MdVisibility /> Ver Contenido</span>
                  {visto && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#059669', fontWeight: 600, fontSize: '0.8rem' }}>
                      <MdCheckCircle /> Visto
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

export default StudentContenidos;
