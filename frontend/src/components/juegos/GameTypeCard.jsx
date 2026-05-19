import React from 'react';
import './GameTypeCard.css';

const GameTypeCard = ({ value, icon, label, isSelected, onClick }) => {
  return (
    <div
      onClick={() => onClick(value)}
      className={`game-type-card ${isSelected ? 'selected' : ''}`}
    >
      <div className="game-type-icon">{icon}</div>
      <h4 className="game-type-label">{label}</h4>
      {isSelected && <div className="game-type-indicator">✓</div>}
    </div>
  );
};

export default GameTypeCard;
