import { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdBarChart, MdMenuBook, MdSportsEsports, MdAssignment, MdStar, MdTimeline, MdCheckCircle } from 'react-icons/md';
import './Student.css';

const StudentProgreso = () => {
  const [progreso, setProgreso] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/progreso')
      .then(res => setProgreso(res.data.data))
      .catch(err => console.error('Error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="student-loading"><div className="spinner"></div><p>Cargando tu progreso...</p></div>;
  }

  // Calculate total points from best scores of games and evaluations only (not accumulated)
  const puntosJuegos = (progreso?.gamesCompleted || []).reduce((s, g) => s + (g.puntaje || 0), 0);
  const puntosEvaluaciones = (progreso?.evaluationsCompleted || []).reduce((s, e) => s + (e.puntaje || 0), 0);
  const totalPuntaje = puntosJuegos + puntosEvaluaciones;

  const totalAvance = progreso?.progressByModule?.reduce((s, p) => s + parseFloat(p.porcentaje_avance || 0), 0) || 0;
  const numModulos = progreso?.progressByModule?.length || 1;
  const promedioAvance = Math.round(totalAvance / numModulos);

  return (
    <div className="student-page">
      <div className="page-header">
        <h1><MdBarChart /> Mi Progreso</h1>
        <p>Revisa tu avance académico y logros alcanzados</p>
      </div>

      <div className="progreso-resumen">
        <div className="resumen-card puntos">
          <MdStar className="resumen-icon" />
          <div><span className="resumen-valor">{totalPuntaje}</span><span className="resumen-label">Puntos Totales</span></div>
        </div>
        <div className="resumen-card avance">
          <MdTimeline className="resumen-icon" />
          <div><span className="resumen-valor">{promedioAvance}%</span><span className="resumen-label">Avance Promedio</span></div>
        </div>
        <div className="resumen-card modulos">
          <MdCheckCircle className="resumen-icon" />
          <div><span className="resumen-valor">{progreso?.progressByModule?.length || 0}</span><span className="resumen-label">Módulos Iniciados</span></div>
        </div>
      </div>

      {progreso?.progressByModule?.length > 0 && (
        <div className="modulos-progreso">
          <h2>Progreso por Módulo</h2>
          {progreso.progressByModule.map((mod, i) => (
            <div key={i} className="modulo-progreso-card">
              <div className="modulo-progreso-header">
                <h3>{mod.modulo}</h3>
                <span className="nivel-badge">Nivel {mod.nivel}</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${parseFloat(mod.porcentaje_avance)}%` }}><span>{parseFloat(mod.porcentaje_avance)}%</span></div>
              </div>
              <div className="modulo-progreso-stats">
                <span>Puntaje: {mod.puntaje_total} pts</span>
                {mod.ultima_actividad && <span>Última actividad: {new Date(mod.ultima_actividad).toLocaleDateString()}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="actividad-grid">
        <div className="actividad-col">
          <h2><MdMenuBook /> Contenidos Vistos</h2>
          {progreso?.contentsViewed?.length > 0 ? (
            <div className="actividad-lista">
              {progreso.contentsViewed.map((item, i) => {
                const nombre = item.contenido?.titulo || `Contenido #${item.contenido_id}`;
                return (
                  <div key={i} className="actividad-item">
                    <MdMenuBook className="actividad-icon" />
                    <div><span className="actividad-nombre">{nombre}</span><span className="actividad-fecha">{new Date(item.fecha).toLocaleDateString()}</span></div>
                    <MdCheckCircle className="completado-icon" />
                  </div>
                );
              })}
            </div>
          ) : <p className="sin-actividad">No has visto contenidos aún.</p>}
        </div>

        <div className="actividad-col">
          <h2><MdSportsEsports /> Juegos Completados</h2>
          {progreso?.gamesCompleted?.length > 0 ? (
            <div className="actividad-lista">
              {progreso.gamesCompleted.map((item, i) => {
                const nombre = item.juego?.titulo || `Juego #${item.juego_id}`;
                return (
                  <div key={i} className="actividad-item">
                    <MdSportsEsports className="actividad-icon" />
                    <div><span className="actividad-nombre">{nombre}</span><span className="actividad-fecha">{new Date(item.fecha).toLocaleDateString()}</span></div>
                    <span className="puntaje-badge">{item.puntaje} pts</span>
                  </div>
                );
              })}
            </div>
          ) : <p className="sin-actividad">No has completado juegos aún.</p>}
        </div>

        <div className="actividad-col">
          <h2><MdAssignment /> Evaluaciones Realizadas</h2>
          {progreso?.evaluationsCompleted?.length > 0 ? (
            <div className="actividad-lista">
              {progreso.evaluationsCompleted.map((item, i) => {
                const nombre = item.evaluacion?.titulo || `Evaluación #${item.evaluacion_id}`;
                return (
                  <div key={i} className="actividad-item">
                    <MdAssignment className="actividad-icon" />
                    <div><span className="actividad-nombre">{nombre}</span><span className="actividad-fecha">{new Date(item.fecha).toLocaleDateString()}</span></div>
                    <span className="puntaje-badge">{item.puntaje} pts</span>
                  </div>
                );
              })}
            </div>
          ) : <p className="sin-actividad">No has realizado evaluaciones aún.</p>}
        </div>
      </div>
    </div>
  );
};

export default StudentProgreso;
