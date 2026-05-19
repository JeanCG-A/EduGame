import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdSchool } from 'react-icons/md';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const userData = JSON.parse(jsonPayload);
      const isStudent = userData.role === 'student' || userData.role === 'estudiante';
      if (isStudent) {
        navigate('/student/dashboard', { replace: true });
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error("Error decodificando token", error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <div className="loading">Cargando plataforma...</div>;

  const isTeacher = user.role === 'teacher' || user.role === 'docente';
  const userName = user.name || (isTeacher ? 'Docente' : 'Estudiante'); // Captura el nombre

  return (
    <div className="dashboard-container">
      {/* Panel Lateral */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon-small">
            <MdSchool />
          </div>
          <h2>EduGame</h2>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <span>🏠</span> Inicio
          </a>




          {/* Menú condicional según el rol */}
          {isTeacher ? (
            <>
              <a href="#" className="nav-item"><span>👥</span> Gestión de Alumnos</a>
              <Link to="/contenidos" className="nav-item"><span>📚</span> Mis Contenidos</Link>
              <Link to="/evaluaciones" className="nav-item"><span>📝</span> Evaluaciones</Link>
              <Link to="/juegos" className="nav-item"><span>🎮</span> Biblioteca de Juegos</Link>
              <Link to="/registroEstudiante" className="nav-item"><span>🎓</span> Registrar Estudiante</Link>          
                </>
          ) : (
            <>
              <Link to="/contenidos" className="nav-item"><span>📚</span> Mis Clases</Link>
              <Link to="/evaluaciones" className="nav-item"><span>📝</span> Mis Evaluaciones</Link>
              <Link to="/juegos" className="nav-item"><span>🎮</span> Zona de Juegos</Link>
              <a href="#" className="nav-item"><span>🏆</span> Mi Progreso</a>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span>🚪</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="dashboard-main">
        <header className="main-header">
          <h1>Panel Principal</h1>
          <div className={`user-badge ${isTeacher ? 'teacher-badge' : 'student-badge'}`}>
            <span className="user-role">{isTeacher ? '👨‍🏫 Docente' : '🎓 Estudiante'}</span>
            <span className="user-name">{userName}</span>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="welcome-card">
            <h2>¡Hola {userName}! 👋</h2> {/* Saludo personalizado */}
            <p>
              Estás conectado como <strong>{isTeacher ? 'Profesor' : 'Alumno'}</strong>.
              Pronto conectaremos los módulos aquí para que puedas empezar a {isTeacher ? 'crear contenidos interactivos y ver el progreso de tus alumnos' : 'jugar, aprender y subir de nivel'}.
            </p>
          </div>

          <div className="stats-grid">
            {isTeacher ? (
              <>
                <div className="stat-card"><h3>Alumnos Registrados</h3><p>--</p></div>
                <div className="stat-card"><h3>Juegos Activos</h3><p>--</p></div>
                <div className="stat-card"><h3>Evaluaciones</h3><p>--</p></div>
              </>
            ) : (
              <>
                <div className="stat-card"><h3>Nivel Actual</h3><p>1</p></div>
                <div className="stat-card"><h3>Puntos Totales</h3><p>0</p></div>
                <div className="stat-card"><h3>Juegos Superados</h3><p>0</p></div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;