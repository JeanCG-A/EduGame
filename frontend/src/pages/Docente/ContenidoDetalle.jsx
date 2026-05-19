import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './ContenidoDetalle.css';

const ContenidoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [contenido, setContenido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const isEditMode = location.pathname.endsWith('/editar');
  
  // Temporal: Simula un hook de autenticación
  const isTeacher = true;

  const [formValues, setFormValues] = useState({
    titulo: '',
    descripcion: '',
    tipo: '',
    modulo: '',
    contenido: '',
  });

  useEffect(() => {
    const fetchContenido = async () => {
      try {
        const response = await api.get(`/contenidos/${id}`);
        const data = response.data?.data || null;

        if (!data) {
          setError('Contenido no encontrado.');
          return;
        }

        setContenido(data);
        setFormValues({
          titulo: data.titulo || '',
          descripcion: data.descripcion || '',
          tipo: data.tipo || '',
          modulo: data.modulo || '',
          contenido: data.contenido || '',
        });

      } catch (err) {
        console.error('Error al cargar el contenido:', err);
        setError('No se pudo cargar el contenido. Verifica el ID o la conexión.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchContenido();
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleTogglePublicar = async (contenidoItem) => {
    const result = await Swal.fire({
      title: `¿${contenidoItem.publicado ? 'Despublicar' : 'Publicar'} contenido?`,
      text: contenidoItem.publicado
        ? 'Al despublicarlo podrás editarlo de nuevo y eliminarlo.'
        : 'Al publicarlo estará visible para estudiantes y no podrá editarse ni eliminarse.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: contenidoItem.publicado ? '#f59e0b' : '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: contenidoItem.publicado ? 'Despublicar' : 'Publicar',
      cancelButtonText: 'Cancelar',
    });
    
    if (result.isConfirmed) {
      try {
        await api.put(`/contenidos/${contenidoItem.id}`, { publicado: !contenidoItem.publicado });
        // Recargar el contenido actualizado
        const response = await api.get(`/contenidos/${id}`);
        setContenido(response.data?.data);
        Swal.fire('¡Actualizado!', `Contenido ${contenidoItem.publicado ? 'despublicado' : 'publicado'} correctamente.`, 'success');
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Error al cambiar estado.', 'error');
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formValues.titulo || !formValues.tipo || !formValues.modulo) {
      setError('Los campos título, tipo y módulo son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      console.log('Enviando PUT /contenidos/', id, formValues);
      await api.put(`/contenidos/${id}`, formValues);
      setSuccess('Contenido actualizado correctamente.');
      setTimeout(() => {
        navigate(`/contenidos`);
      }, 900);
    } catch (err) {
      console.error('Error al actualizar el contenido:', err);
      setError('Hubo un error al actualizar el contenido. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar contenido?',
      html: `¿Estás seguro de que deseas eliminar <strong>"${contenido.titulo}"</strong>?<br/><small style="color:#ef4444">Esta acción no puede deshacerse.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    
    if (result.isConfirmed) {
      try {
        await api.delete(`/contenidos/${contenido.id || contenido._id}`);
        Swal.fire({ 
          title: '¡Eliminado!', 
          text: 'El contenido ha sido eliminado correctamente.',
          icon: 'success', 
          timer: 2000, 
          showConfirmButton: false 
        });
        navigate('/contenidos');
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'No se pudo eliminar.', 'error');
      }
    }
  };

  if (loading) {
    return <div className="detalle-mensaje">Cargando contenido...</div>;
  }

  if (error && !contenido) {
    return <div className="detalle-mensaje error">{error}</div>;
  }

  if (!contenido) {
    return <div className="detalle-mensaje">Contenido no encontrado.</div>;
  }

  return (
    <div className="detalle-container">
      <button className="detalle-back" onClick={() => navigate('/contenidos')}>
        ← Volver
      </button>

      {isEditMode && isTeacher ? (
        <form className="detalle-card" onSubmit={handleSubmit}>
          {error && <div className="detalle-mensaje error">{error}</div>}
          {success && <div className="detalle-mensaje success">{success}</div>}

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
            Informacion del contenido
            <textarea
              name="descripcion"
              value={formValues.descripcion}
              onChange={handleChange}
              rows="4"
              placeholder="Informacion completa del contenido (opcional)"
            />
          </label>

          <label>
            Módulo
            <input
              name="modulo"
              value={formValues.modulo}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Tipo de trabajo o contenido
            <select name="tipo" value={formValues.tipo} onChange={handleChange} required>
              <option value="">Selecciona un tipo</option>
              <option value="video">Video</option>
              <option value="texto">Texto</option>
              <option value="imagen">Imagen</option>
            </select>
          </label>

          <label>
            Apoyo Extra para el contenido
            <textarea
              name="contenido"
              value={formValues.contenido}
              onChange={handleChange}
              placeholder="Texto o URL del contenido"
              rows="5"
              required
            />
          </label>

          <div className="detalle-actions-edicion">
            <button type="submit" className="submit-btn-contenido" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button 
              type="button" 
              className="cancel-btn-contenido" 
              onClick={() => navigate(`/contenidos/${id}`)}
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (

        // Modo Vista del Contenido informacion general
        <div className="detalle-card">
          <h2 className="detalle-titulo">{contenido.titulo}</h2>
          <p><strong className="detalle-modulo">Módulo:</strong> {contenido.modulo}</p>
          <p><strong className="detalle-tipo">Tipo del contenido:</strong> {contenido.tipo}</p>
          <p className="detalle-descripcion">{contenido.descripcion}</p>
          <p className="detalle-contenido">{contenido.contenido}</p>
          
          {isTeacher && (
            <div className="detalle-actions">
              <button
                className={`publicar-btn ${contenido.publicado ? 'despublicar' : ''}`}
                onClick={() => handleTogglePublicar(contenido)}
              >
                {contenido.publicado ? '🔒 Despublicar' : '🚀 Publicar'}
              </button>
            {!contenido.publicado && (
              <Link to={`/contenidos/${id}/editar`} className="editar-btn-contenido">
                Editar
              </Link>
            )}
            {!contenido.publicado && (
              <button className="eliminar-btn" onClick={handleDelete}>
                <FaTrashAlt style={{ marginRight: '1px' }} />
              </button>
            )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContenidoDetalle;