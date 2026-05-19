import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { MdSportsEsports, MdPlayArrow, MdStars, MdCheckCircle, MdGridOn, MdExtension, MdMemory, MdCompareArrows, MdQuiz } from 'react-icons/md';
import './Student.css';

const tipoIconos = { sopa_de_letras: <MdGridOn />, crucigrama: <MdExtension />, memoria: <MdMemory />, relacionar: <MdCompareArrows />, adivinanza: <MdQuiz /> };
const tipoNombres = { sopa_de_letras: '🔍 Sopa de Letras', crucigrama: '📝 Crucigrama', memoria: '🃏 Memoria', relacionar: '🧩 Relacionar', adivinanza: '🤔 Adivinanza' };

const StudentJuegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [completados, setCompletados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/juegos/publicados')
      .then(res => setJuegos(res.data.data || []))
      .catch(err => console.error('Error al cargar juegos:', err))
      .finally(() => setLoading(false));

    api.get('/student/completados')
      .then(res => setCompletados(res.data.data?.juegos || []))
      .catch(() => {});
  }, []);

  if (loading) return <div className="student-loading"><div className="spinner"></div><p>Cargando zona de juegos...</p></div>;

  return (
    <div className="student-page">
      <div className="page-header">
        <h1><MdSportsEsports /> Zona de Juegos</h1>
        <p>¡Aprende jugando! Completa los desafíos y gana puntos</p>
      </div>

      {juegos.length === 0 ? (
        <div className="empty-state">
          <MdSportsEsports className="empty-icon" />
          <h3>No hay juegos disponibles</h3>
          <p>El docente aún no ha publicado juegos educativos.</p>
        </div>
      ) : (
        <div className="catalog-grid">
          {juegos.map(j => {
            const completado = completados.includes(j.id);
            return (
              <Link key={j.id} to={`/student/juegos/${j.id}`} className="catalog-card"
                style={{ borderTop: `4px solid ${completado ? '#059669' : '#0891b2'}` }}>
                <div className="catalog-card-header">
                  <div className="catalog-icon" style={{ background: completado ? '#ecfdf5' : '#ecfeff', color: completado ? '#059669' : '#0891b2' }}>
                    {tipoIconos[j.tipo] || <MdSportsEsports />}
                  </div>
                  <span className="modulo-badge">{j.modulo}</span>
                </div>
                <div className="juego-tipo-label">{tipoNombres[j.tipo] || j.tipo}</div>
                <h3>{j.titulo}</h3>
                {j.puntaje_max && (
                  <div className="juego-puntaje"><MdStars /> Puntaje máximo: {j.puntaje_max} pts</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto' }}>
                  <span className="catalog-btn"><MdPlayArrow /> {completado ? 'Jugar de nuevo' : 'Jugar Ahora'}</span>
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

export default StudentJuegos;
