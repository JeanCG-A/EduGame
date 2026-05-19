import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { MdArrowBack, MdCheckCircle, MdError, MdStars, MdRefresh, MdSportsEsports } from 'react-icons/md';
import Swal from 'sweetalert2';
import AdivinanzaGame from '../../components/games/AdivinanzaGame';
import QuizGame from '../../components/games/QuizGame';
import WordSearchGame from '../../components/games/WordSearchGame';
import CrosswordGame from '../../components/games/CrosswordGame';
import MemoryGame from '../../components/games/MemoryGame';
import '../../components/games/Games.css';
import './Student.css';

const typeNames = { sopa_de_letras: '🔍 Sopa de Letras', crucigrama: '📝 Crucigrama', memoria: '🃏 Memoria', relacionar: '🧩 Relacionar', adivinanza: '🤔 Adivinanza' };

const StudentJuegoResolver = () => {
  const { id } = useParams();
  const [juego, setJuego] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    api.get(`/juegos/${id}`)
      .then(res => {
        const juegoData = res.data.data;
        console.log('[JuegoResolver] Datos recibidos del backend:', juegoData);
        console.log('[JuegoResolver] Configuracion:', juegoData?.configuracion);
        console.log('[JuegoResolver] Tipo:', juegoData?.tipo);
        setJuego(juegoData);
      })
      .catch(err => setError(err.response?.data?.message || 'Error al cargar juego'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleGameComplete = async (datos) => {
    setEnviando(true);
    try {
      const res = await api.post(`/student/juegos/${id}/responder`, { ...datos, juego_id: id });
      setResultado(res.data.data);
      const p = datos.puntaje_obtenido || 0;
      Swal.fire({ icon: p >= 60 ? 'success' : 'info', title: p >= 60 ? '¡Buen trabajo!' : 'Sigue intentando', text: `Obtuviste ${p} puntos`, confirmButtonColor: '#0891b2' });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Error al enviar respuesta' });
    } finally { setEnviando(false); }
  };

  if (loading) return <div className="student-loading"><div className="spinner"></div><p>Cargando juego...</p></div>;
  if (error) return <div className="student-page"><div className="empty-state"><h3>{error}</h3></div></div>;
  if (!juego) return <div className="student-page"><div className="empty-state"><h3>Juego no encontrado</h3></div></div>;

  const renderGame = () => {
    const config = juego.configuracion || {};
    switch (juego.tipo) {
      case 'adivinanza': return <AdivinanzaGame config={config} onComplete={handleGameComplete} />;
      case 'relacionar': return <QuizGame config={config} onComplete={handleGameComplete} />;
      case 'sopa_de_letras': return <WordSearchGame config={config} onComplete={handleGameComplete} />;
      case 'crucigrama': return <CrosswordGame config={config} onComplete={handleGameComplete} />;
      case 'memoria': return <MemoryGame config={config} onComplete={handleGameComplete} />;
      default: return <div className="empty-state"><h3>Tipo de juego no soportado: {juego.tipo}</h3></div>;
    }
  };

  return (
    <div className="student-page">
      <Link to="/student/juegos" className="btn-back"><MdArrowBack /> Volver a Juegos</Link>
      <div className="juego-resolver-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 style={{ margin: 0 }}>{juego.titulo}</h1>
          <span className="juego-tipo-badge"><MdSportsEsports /> {typeNames[juego.tipo] || juego.tipo}</span>
        </div>
        <span className="modulo-badge">{juego.modulo}</span>
      </div>
      <div className="juego-contenido">{renderGame()}</div>
      {resultado && (
        <div className="resultado-card">
          <div className="resultado-icono">{resultado.puntaje_obtenido >= 60 ? <MdCheckCircle style={{ color: '#059669' }} /> : <MdError style={{ color: '#dc2626' }} />}</div>
          <h3>{resultado.puntaje_obtenido >= 60 ? '¡Excelente trabajo!' : 'Sigue practicando'}</h3>
          <div className="resultado-puntaje"><MdStars /> {resultado.puntaje_obtenido} / {resultado.puntaje_maximo} puntos</div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${resultado.porcentaje_logro || Math.round(resultado.puntaje_obtenido / resultado.puntaje_maximo * 100)}%` }}>
              <span>{resultado.porcentaje_logro || Math.round(resultado.puntaje_obtenido / resultado.puntaje_maximo * 100)}%</span>
            </div>
          </div>
          <Link to="/student/juegos" className="btn-volver-jugar"><MdRefresh /> Volver a Juegos</Link>
        </div>
      )}
    </div>
  );
};

export default StudentJuegoResolver;
