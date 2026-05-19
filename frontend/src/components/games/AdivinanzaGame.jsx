import { useState } from 'react';
import { MdQuiz, MdCheckCircle, MdError, MdLightbulb } from 'react-icons/md';

const parseConfig = (c) => (typeof c === 'string' ? (() => { try { return JSON.parse(c); } catch { return {}; } })() : (c || {}));

const AdivinanzaGame = ({ config: rawConfig, onComplete }) => {
  const config = parseConfig(rawConfig);
  const [respuesta, setRespuesta] = useState('');
  const [resultado, setResultado] = useState(null);

  const adivinanza = config?.adivinanza || config?.pregunta || '';
  const pista = config?.pista || '';
  const opciones = ['A', 'B', 'C'].filter(l => config?.[`opcion${l}`]);
  const respuestaCorrecta = config?.respuestaCorrecta || '';

  if (!adivinanza || opciones.length === 0) {
    return (
      <div className="game-empty">
        <MdQuiz className="game-icon-big" />
        <h3>Adivinanza no disponible</h3>
        <p>El docente no ha configurado esta adivinanza correctamente.</p>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!respuesta) return;
    const esCorrecta = respuesta === respuestaCorrecta;
    const puntaje = esCorrecta ? 100 : 0;
    setResultado({ esCorrecta, puntaje });
    onComplete({ puntaje_obtenido: puntaje, respuesta, esCorrecta });
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <MdQuiz className="game-icon" />
        <span className="game-type-label">Adivinanza</span>
      </div>
      <div className="game-content">
        <div className="adivinanza-box">
          <p className="adivinanza-text">{adivinanza}</p>
          {pista && <p className="adivinanza-hint"><MdLightbulb /> {pista}</p>}
        </div>
        <div className="opciones-list">
          {opciones.map(letra => (
            <label key={letra}
              className={`opcion-item ${respuesta === letra ? 'selected' : ''} ${resultado ? (letra === respuestaCorrecta ? 'correct' : respuesta === letra ? 'wrong' : '') : ''}`}>
              <input type="radio" name="adivinanza" value={letra} onChange={() => setRespuesta(letra)} disabled={!!resultado} />
              <span className="opcion-letra-badge">{letra}</span>
              <span className="opcion-texto-badge">{config[`opcion${letra}`]}</span>
              {resultado && letra === respuestaCorrecta && <MdCheckCircle className="icon-check" />}
              {resultado && letra === respuesta && !resultado.esCorrecta && <MdError className="icon-x" />}
            </label>
          ))}
        </div>
      </div>
      {!resultado ? (
        <button className="game-submit-btn" onClick={handleSubmit} disabled={!respuesta}>
          {respuesta ? 'Responder' : 'Selecciona una opción'}
        </button>
      ) : (
        <div className={`game-result ${resultado.esCorrecta ? 'success' : 'fail'}`}>
          {resultado.esCorrecta ? (
            <><MdCheckCircle /> ¡Respuesta correcta! Ganaste 100 puntos</>
          ) : (
            <><MdError /> Respuesta incorrecta. La respuesta correcta era <strong>{respuestaCorrecta}</strong>.</>
          )}
        </div>
      )}
    </div>
  );
};

export default AdivinanzaGame;
