const EvaluationService = require('../services/evaluation.service');
const GameService = require('../services/game.service');
const StudentService = require('../services/student.service');
const ProgressService = require('../services/progress.service');
const Game = require('../models/game.model');
const Evaluation = require('../models/evaluation.model');

class RespuestasController {
  static async responderEvaluacion(req, res) {
    try {
      const estudianteId = req.user.id;
      const { id } = req.params;
      const { respuestas, tiempo } = req.body;

      if (!respuestas || !Array.isArray(respuestas)) {
        return res.status(400).json({
          success: false,
          message: 'Debe enviar un arreglo de respuestas válido.'
        });
      }

      const resultado = await EvaluationService.responderEvaluacion(id, respuestas);

      const evaluacion = await Evaluation.findByPk(id);
      if (evaluacion) {
        const progRecord = await StudentService.registerEvaluationResult(estudianteId, id, resultado.puntaje);
        if (!progRecord.wasExisting) {
          await ProgressService.actualizarProgreso(estudianteId, evaluacion.modulo, resultado.puntaje, 10);
        }
      }

      res.status(200).json({
        success: true,
        message: `Evaluación calificada. Obtuviste ${resultado.puntaje}/100`,
        data: { ...resultado, tiempo }
      });
    } catch (error) {
      if (error.message.includes('no encontrada')) {
        return res.status(404).json({ success: false, message: error.message });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async responderJuego(req, res) {
    try {
      const estudianteId = req.user.id;
      const { id } = req.params;
      const datosIntento = req.body;

      if (!datosIntento || Object.keys(datosIntento).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Debe enviar los datos del intento.'
        });
      }

      const resultado = await GameService.responderJuego(id, datosIntento);

      const juego = await Game.findByPk(id);
      if (juego) {
        const progRecord = await StudentService.registerGameResult(estudianteId, id, resultado.puntaje_obtenido);
        if (!progRecord.wasExisting) {
          await ProgressService.actualizarProgreso(estudianteId, juego.modulo, resultado.puntaje_obtenido, 15);
        }
      }

      res.status(200).json({
        success: true,
        message: `Juego completado. Puntaje: ${resultado.puntaje_obtenido}/${resultado.puntaje_maximo}`,
        data: resultado
      });
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({ success: false, message: error.message });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = RespuestasController;
