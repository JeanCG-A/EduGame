const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Evaluation = sequelize.define('Evaluation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  modulo: { type: DataTypes.STRING, allowNull: false },
  docente_id: { type: DataTypes.INTEGER, allowNull: false },
  tiempoLimitado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  tiempoMinutos: { type: DataTypes.INTEGER, allowNull: true },
  publicado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Si es true, la evaluación no puede editarse ni eliminarse'
  }
}, {
  timestamps: true,
  tableName: 'evaluaciones'
});

module.exports = Evaluation;
