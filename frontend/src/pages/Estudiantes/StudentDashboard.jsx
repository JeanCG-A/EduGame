import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { MdSchool } from 'react-icons/md';
import '../Dashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/dashboard')
      .then(res => setData(res.data.data))
      .catch(err => console.error('Error:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  if (loading) return <div className="loading">Cargando plataforma...</div>;

  const userName = user?.name || 'Estudiante';

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon-small"><MdSchool /></div>
          <h2>EduGame</h2>
        </div>
        
        <nav className="sidebar-nav">
          <a className="nav-item active"><span>🏠</span> Inicio</a>
          <Link to="/student/contenidos" className="nav-item"><span>📚</span> Mis Clases</Link>
          <Link to="/student/evaluaciones" className="nav-item"><span>📝</span> Mis Evaluaciones</Link>
          <Link to="/student/juegos" className="nav-item"><span>🎮</span> Zona de Juegos</Link>
          <Link to="/student/progreso" className="nav-item"><span>🏆</span> Mi Progreso</Link>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn"><span>🚪</span> Cerrar Sesión</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="main-header">
          <h1>Panel de Estudiante</h1>
          <div className="user-badge student-badge">
            <span className="user-role">🎓 Estudiante</span>
            <span className="user-name">{userName}</span>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="welcome-card" style={{ background: 'linear-gradient(135deg, #00b050, #008a3e)' }}>
            <h2>¡Hola {userName}! 👋</h2>
            <p>Bienvenido a tu espacio de aprendizaje. Revisa tus contenidos, juegos, evaluaciones y sigue progresando. ¡Cada paso cuenta!</p>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontWeight: 600, marginBottom: '1rem' }}>
              <span>📊</span> Progreso General
            </div>
            <div className="progress-bar-container" style={{ height: '1.5rem', background: '#e2e8f0', borderRadius: '1rem', overflow: 'hidden' }}>
              <div className="progress-bar" style={{ width: `${data?.overallProgress || 0}%`, height: '100%', background: 'linear-gradient(90deg, #00b050, #008a3e)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 700, transition: 'width 1s ease' }}>
                {data?.overallProgress || 0}%
              </div>
            </div>
            {data?.completedModules?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                {data.completedModules.map((mod, i) => (
                  <span key={i} style={{ background: '#ecfdf5', color: '#059669', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>✓ {mod}</span>
                ))}
              </div>
            )}
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>📚 Contenidos</h3>
              <p>{data?.contentsViewed || 0}/{data?.totalContents || 0}</p>
            </div>
            <div className="stat-card">
              <h3>🎮 Juegos</h3>
              <p>{data?.gamesCompleted || 0}/{data?.totalGames || 0}</p>
            </div>
            <div className="stat-card">
              <h3>📝 Evaluaciones</h3>
              <p>{data?.evaluationsCompleted || 0}/{data?.totalEvaluations || 0}</p>
            </div>
            <div className="stat-card">
              <h3>🏆 Módulos</h3>
              <p>{data?.completedModules?.length || 0}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
