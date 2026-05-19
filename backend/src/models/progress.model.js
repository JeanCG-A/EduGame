const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Referencia al ID del estudiante'
  },
  modulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  puntaje_total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  nivel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // Los alumnos inician en nivel 1
  },
  porcentaje_avance: {
    type: DataTypes.DECIMAL(5, 2), // Permite valores como 99.99
    allowNull: false,
    defaultValue: 0.00,
  },
  ultima_actividad: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: false, // Desactivamos timestamps ya que se solicitó explícitamente ultima_actividad
  tableName: 'progreso'
});

module.exports = Progress;
