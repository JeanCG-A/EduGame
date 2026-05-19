import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { MdArrowBack, MdCheckCircle, MdVideoLibrary, MdDescription, MdLink, MdTextFields } from 'react-icons/md';
import './Student.css';

const StudentContenidoDetalle = () => {
  const { id } = useParams();
  const [contenido, setContenido] = useState(null);
  const [accesoRegistrado, setAccesoRegistrado] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/contenidos/${id}`);
        setContenido(res.data.data);
        await api.post(`/student/contenidos/${id}/acceder`);
        setAccesoRegistrado(true);
      } catch (err) { console.error('Error:', err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) {
    return <div className="student-loading"><div className="spinner"></div><p>Cargando contenido...</p></div>;
  }

  if (!contenido) {
    return <div className="student-page"><h2>Contenido no encontrado</h2></div>;
  }

  const renderContent = () => {
    switch (contenido.tipo) {
      case 'video':
        return <div className="video-container"><iframe src={contenido.contenido} title={contenido.titulo} allowFullScreen></iframe></div>;
      case 'pdf':
        return <div className="video-container"><iframe src={contenido.contenido} title={contenido.titulo}></iframe></div>;
      case 'enlace':
        return <div className="enlace-container"><MdLink className="enlace-icon" /><a href={contenido.contenido} target="_blank" rel="noopener noreferrer" className="enlace-btn">Abrir Recurso Externo</a></div>;
      case 'texto':
      default:
        return <div className="texto-container"><p>{contenido.contenido}</p></div>;
    }
  };

  return (
    <div className="student-page">
      <Link to="/student/contenidos" className="btn-back"><MdArrowBack /> Volver a Contenidos</Link>
      <div className="detalle-header">
        <span className="tipo-badge" data-tipo={contenido.tipo}>
          {contenido.tipo === 'video' ? <MdVideoLibrary /> : contenido.tipo === 'pdf' ? <MdDescription /> : contenido.tipo === 'enlace' ? <MdLink /> : <MdTextFields />}
          {contenido.tipo}
        </span>
        <span className="modulo-badge">{contenido.modulo}</span>
      </div>
      <h1 className="detalle-titulo">{contenido.titulo}</h1>
      <p className="detalle-descripcion">{contenido.descripcion}</p>
      <div className="detalle-contenido">{renderContent()}</div>
      {accesoRegistrado && (
        <div className="acceso-confirmado"><MdCheckCircle /> Acceso registrado exitosamente</div>
      )}
    </div>
  );
};

export default StudentContenidoDetalle;
