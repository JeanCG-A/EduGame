const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StudentProgress = sequelize.define('StudentProgress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  estudiante_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  contenido_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  juego_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  evaluacion_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  completado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  puntaje: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: false,
  tableName: 'progreso_estudiante'
});

module.exports = StudentProgress;
