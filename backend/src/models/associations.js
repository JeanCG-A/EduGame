const Content = require('./content.model');
const Game = require('./game.model');
const Evaluation = require('./evaluation.model');
const StudentProgress = require('./studentProgress.model');

StudentProgress.belongsTo(Content, { foreignKey: 'contenido_id', as: 'contenido' });
StudentProgress.belongsTo(Game, { foreignKey: 'juego_id', as: 'juego' });
StudentProgress.belongsTo(Evaluation, { foreignKey: 'evaluacion_id', as: 'evaluacion' });

module.exports = { StudentProgress, Content, Game, Evaluation };
