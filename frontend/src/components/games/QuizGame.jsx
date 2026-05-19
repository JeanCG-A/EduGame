import { useState, useMemo } from 'react';
import { MdCompareArrows, MdCheckCircle, MdError, MdArrowForward } from 'react-icons/md';

const parseConfig = (c) => (typeof c === 'string' ? (() => { try { return JSON.parse(c); } catch { return {}; } })() : (c || {}));

const QuizGame = ({ config: rawConfig, onComplete }) => {
  const config = parseConfig(rawConfig);
  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState(null);

  const pares = useMemo(() => (config?.pares || []).filter(p => p.columnaA && p.columnaB), [rawConfig]);
  const shuffledB = useMemo(() => pares.length > 0 ? [...pares].sort(() => Math.random() - 0.5) : [], [pares.length]);

  if (pares.length === 0) {
    return (
      <div className="game-empty">
        <MdCompareArrows className="game-icon-big" />
        <h3>Relacionar no disponible</h3>
        <p>El docente no ha configurado este juego correctamente.</p>
      </div>
    );
  }

  const handleSubmit = () => {
    let correctas = 0;
    pares.forEach((par, i) => {
      if (respuestas[`r_${i}`] === par.columnaB) correctas++;
    });
    const puntaje = Math.round((correctas / pares.length) * 100);
    setResultado({ correctas, total: pares.length, puntaje });
    onComplete({ puntaje_obtenido: puntaje, respuestas });
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <MdCompareArrows className="game-icon" />
        <span className="game-type-label">Relacionar Conceptos</span>
        <span className="game-hint">Conecta cada elemento de la columna A con su par en la columna B</span>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem',
        maxWidth: '700px', margin: '0 auto', alignItems: 'center'
      }}>
        {/* Col A */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ textAlign: 'center', fontWeight: 700, color: '#4f46e5', paddingBottom: '0.5rem', borderBottom: '2px solid #e0e7ff', marginBottom: '0.25rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Columna A</div>
          {pares.map((par, i) => (
            <div key={i} style={{
              padding: '0.9rem 1.25rem', background: resultado
                ? (respuestas[`r_${i}`] === par.columnaB ? '#ecfdf5' : '#fef2f2')
                : '#eef2ff',
              color: resultado
                ? (respuestas[`r_${i}`] === par.columnaB ? '#059669' : '#dc2626')
                : '#4f46e5',
              borderRadius: '0.75rem', fontWeight: 600, textAlign: 'center', fontSize: '0.95rem',
              border: `2px solid ${resultado
                ? (respuestas[`r_${i}`] === par.columnaB ? '#86efac' : '#fecaca')
                : '#e0e7ff'}`,
              transition: 'all 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
            }}>
              {par.columnaA}
              {resultado && respuestas[`r_${i}`] === par.columnaB && (
                <MdCheckCircle style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
              )}
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          {pares.map((_, i) => (
            <div key={i} style={{
              width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: resultado
                ? (respuestas[`r_${i}`] ? (respuestas[`r_${i}`] === pares[i].columnaB ? '#059669' : '#dc2626') : '#94a3b8')
                : respuestas[`r_${i}`] ? '#6366f1' : '#d1d5db',
              transition: 'color 0.3s ease'
            }}>
              <MdArrowForward size={20} />
            </div>
          ))}
        </div>

        {/* Col B */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ textAlign: 'center', fontWeight: 700, color: '#0891b2', paddingBottom: '0.5rem', borderBottom: '2px solid #cffafe', marginBottom: '0.25rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Columna B</div>
          {shuffledB.map((item, i) => {
            const idx = pares.findIndex(p => p.columnaB === item.columnaB);
            const selected = respuestas[`r_${idx}`];
            const isCorrect = resultado && selected === item.columnaB;
            const isWrong = resultado && selected && selected !== item.columnaB;
            return (
              <select key={`${idx}-${item.columnaB}`}
                value={selected || ''}
                onChange={(e) => setRespuestas(prev => ({ ...prev, [`r_${idx}`]: e.target.value }))}
                disabled={!!resultado}
                style={{
                  padding: '0.9rem 1.25rem', borderRadius: '0.75rem',
                  border: `2px solid ${isCorrect ? '#86efac' : isWrong ? '#fecaca' : '#cffafe'}`,
                  background: isCorrect ? '#ecfdf5' : isWrong ? '#fef2f2' : 'white',
                  color: isCorrect ? '#059669' : isWrong ? '#dc2626' : '#334155',
                  fontWeight: 600, fontSize: '0.95rem', cursor: resultado ? 'default' : 'pointer',
                  transition: 'all 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                  outline: 'none', fontFamily: 'inherit'
                }}>
                <option value="">—</option>
                {pares.map(p => <option key={p.columnaB} value={p.columnaB}>{p.columnaB}</option>)}
              </select>
            );
          })}
        </div>
      </div>

      {!resultado ? (
        <button className="game-submit-btn" onClick={handleSubmit} disabled={Object.keys(respuestas).length === 0}>
          {Object.keys(respuestas).length > 0 ? 'Verificar respuestas' : 'Relaciona los elementos primero'}
        </button>
      ) : (
        <div className={`game-result ${resultado.puntaje >= 60 ? 'success' : 'fail'}`}>
          <p><MdCheckCircle /> Acertaste {resultado.correctas} de {resultado.total} pares</p>
          <p className="result-score">Puntaje: {resultado.puntaje}/100</p>
        </div>
      )}
    </div>
  );
};

export default QuizGame;
