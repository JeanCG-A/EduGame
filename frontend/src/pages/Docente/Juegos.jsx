import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FaTrashAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import './Juegos.css';

const TIPO_ICONOS = {
  sopa_de_letras: '🔍',
  crucigrama: '📝',
  adivinanza: '🤔',
  memoria: '🃏',
  relacionar: '🧩',
};

const Juegos = () => {
  const { isTeacher } = useAuth();
  const navigate = useNavigate();
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchJuegos(); }, []);

  const fetchJuegos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/juegos');
      setJuegos(response.data?.data || []);
    } catch (err) {
      setError('Hubo un problema al cargar los juegos.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (juego) => {
    const result = await Swal.fire({
      title: '¿Eliminar juego?',
      html: `¿Estás seguro de que deseas eliminar <strong>"${juego.titulo}"</strong>?<br/><small style="color:#ef4444">Esta acción no puede deshacerse.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/juegos/${juego.id}`);
        setJuegos(prev => prev.filter(j => j.id !== juego.id));
        Swal.fire({ title: '¡Eliminado!', text: 'El juego fue eliminado correctamente.', icon: 'success', timer: 2000, showConfirmButton: false });
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'No se pudo eliminar el juego.', 'error');
      }
    }
  };

  const handleTogglePublicar = async (juego) => {
    const result = await Swal.fire({
      title: `¿${juego.publicado ? 'Despublicar' : 'Publicar'} juego?`,
      text: juego.publicado
        ? 'Al despublicarlo podrás editarlo de nuevo y elminarlo.'
        : 'Al publicarlo estará visible para estudiantes y no podrá editarse y eliminarse.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: juego.publicado ? '#f59e0b' : '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: juego.publicado ? 'Despublicar' : 'Publicar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      try {
        await api.put(`/juegos/${juego.id}`, { publicado: !juego.publicado });
        fetchJuegos();
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Error al cambiar estado.', 'error');
      }
    }
  };

  

  if (loading) return <div className="juegos-mensaje">Cargando juegos...</div>;
  if (error) return <div className="juegos-mensaje error">{error}</div>;

  return (
    <div className="juegos-container">
      <div className="juegos-header">
        <h2 className="juegos-titulo">Juegos Interactivos</h2>
        {isTeacher && (
                  <Link to="/crear-juegos" className="crear-juego-btn">
                    Crear Juego
                  </Link>
                )}
      </div>

      {juegos.length === 0 ? (
        <div className="juegos-vacio">
          <p>No hay juegos disponibles en este momento.</p>
          {isTeacher && <Link to="/crear-juegos" className="juegos-crear-btn">Crear el primer juego</Link>}
        </div>
      ) : (
        <div className="juegos-grid">
          {juegos.map((juego) => (
            <div key={juego.id} className={`juego-card ${juego.publicado ? 'publicado' : ''}`}>
              <div className="juego-icon">{TIPO_ICONOS[juego.tipo] || '🎮'}</div>
              <div className="juego-info">
                <h3 className="card-titulo">{juego.titulo}</h3>
                <div className="card-info">
                  <span className="badge badge-tipo">{juego.tipo?.replace(/_/g, ' ')}</span>
                  <span className="badge badge-modulo">📚 {juego.modulo}</span>
                  {juego.publicado && <span className="badge badge-publicado">✅ Publicado</span>}
                </div>
              </div>
              {isTeacher && (
                <div className="botones-accion">

                   <button
                    className={`publicar-btn ${juego.publicado ? 'despublicar' : ''}`}
                    onClick={() => handleTogglePublicar(juego)}
                  >
                    {juego.publicado ? '🔒 Despublicar' : '🚀 Publicar'}
                  </button>
                  {!juego.publicado && (
                    <Link to={`/editar-juego/${juego.id}`} className="editar-btn-juego">
                      Editar
                    </Link>
                  )}
                  {!juego.publicado && (
                    <button className="eliminar-btn" onClick={() => handleEliminar(juego)}>
                      <FaTrashAlt style={{ marginRight: '1px' }} />
                    </button>
                )}
                  </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Juegos;