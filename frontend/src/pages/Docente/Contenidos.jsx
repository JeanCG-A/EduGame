import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Contenidos.css';

const Contenidos = () => {
  const { isTeacher } = useAuth();
  const [contenidos, setContenidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContenidos = async () => {
      try {
        const response = await api.get('/contenidos');
        setContenidos(response.data?.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar los contenidos:', err);
        setError('Hubo un problema al cargar los contenidos.');
        setLoading(false);
      }
    };

    fetchContenidos();
  }, []);

  if (loading) {
    return <div className="contenidos-mensaje">Cargando contenidos...</div>;
  }

  if (error) {
    return <div className="contenidos-mensaje error">{error}</div>;
  }

  return (
    <div className="contenidos-container">
      <div className="contenidos-header">
        <h2 className="contenidos-titulo">📚 Lista de Contenidos</h2>
        {isTeacher && (
          <Link to="/crear-contenido" className="crear-contenido-btn">
             Crear Contenido
          </Link>
        )}
      </div>

      {contenidos.length === 0 ? (
        <div className="contenidos-vacio">
          <p>No hay contenidos disponibles en este momento.</p>
          {isTeacher && (
            <Link to="/crear-contenido" className="crear-contenido-btn">
              Crear el primer contenido
            </Link>
          )}
        </div>
      ) : (
        <div className="contenidos-grid ">
          {contenidos.map((contenido) => (
            <Link
              key={contenido.id || contenido._id}
              to={`/contenidos/${contenido.id || contenido._id}`}
              className={`contenido-card contenido-link ${contenido.publicado ? 'publicado' : ''}`}
            >
              <h3 className="card-titulo">{contenido.titulo}</h3>
              <div className="card-info">
                <span className="badge badge-tipo">{contenido.tipo}</span>
                <span className="badge badge-modulo">📚 Módulo {contenido.modulo}</span>
                {contenido.publicado && <span className="badge badge-publicado">✅ Publicado</span>}
              </div>
              {contenido.descripcion && (
                <p className="card-descripcion">{contenido.descripcion}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contenidos;