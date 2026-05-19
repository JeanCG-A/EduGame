const Content = require('../models/content.model');
const Game = require('../models/game.model');
const Evaluation = require('../models/evaluation.model');
const StudentProgress = require('../models/studentProgress.model');
const Progress = require('../models/progress.model');
const { Op } = require('sequelize');

class StudentService {
  static async getDashboardData(estudianteId) {
    const totalContents = await Content.count({ where: { publicado: true } });
    const totalGames = await Game.count({ where: { publicado: true } });
    const totalEvaluations = await Evaluation.count({ where: { publicado: true } });

    const progressRecords = await Progress.findAll({ where: { usuario_id: estudianteId } });
    const totalProgress = progressRecords.reduce((sum, p) => sum + parseFloat(p.porcentaje_avance || 0), 0);
    const moduleCount = progressRecords.length || 1;
    const overallProgress = Math.round(totalProgress / moduleCount);

    const completedModules = progressRecords
      .filter(p => parseFloat(p.porcentaje_avance) >= 100)
      .map(p => p.modulo);

    const recentActivity = await StudentProgress.findAll({
      where: { estudiante_id: estudianteId },
      order: [['fecha', 'DESC']],
      limit: 5
    });

    // Count completed items, only if the referenced item still exists
    const cvRecords = await StudentProgress.findAll({
      where: { estudiante_id: estudianteId, contenido_id: { [Op.ne]: null }, completado: true },
      attributes: ['contenido_id']
    });
    const cvIds = cvRecords.map(r => r.contenido_id);
    const contentsViewed = cvIds.length > 0
      ? await Content.count({ where: { id: cvIds, publicado: true } })
      : 0;

    const gcRecords = await StudentProgress.findAll({
      where: { estudiante_id: estudianteId, juego_id: { [Op.ne]: null }, completado: true },
      attributes: ['juego_id']
    });
    const gcIds = gcRecords.map(r => r.juego_id);
    const gamesCompleted = gcIds.length > 0
      ? await Game.count({ where: { id: gcIds, publicado: true } })
      : 0;

    const ecRecords = await StudentProgress.findAll({
      where: { estudiante_id: estudianteId, evaluacion_id: { [Op.ne]: null }, completado: true },
      attributes: ['evaluacion_id']
    });
    const ecIds = ecRecords.map(r => r.evaluacion_id);
    const evaluationsCompleted = ecIds.length > 0
      ? await Evaluation.count({ where: { id: ecIds, publicado: true } })
      : 0;

    return {
      totalContents,
      contentsViewed,
      totalGames,
      gamesCompleted,
      totalEvaluations,
      evaluationsCompleted,
      completedModules,
      overallProgress,
      recentActivity
    };
  }

  static async registerContentView(estudianteId, contenidoId) {
    const [record, created] = await StudentProgress.findOrCreate({
      where: { estudiante_id: estudianteId, contenido_id: contenidoId },
      defaults: {
        estudiante_id: estudianteId,
        contenido_id: contenidoId,
        completado: true,
        puntaje: 0,
        fecha: new Date()
      }
    });
    if (!created) {
      await record.update({ completado: true, fecha: new Date() });
    }
    return record;
  }

  static async registerGameResult(estudianteId, juegoId, puntaje) {
    const existing = await StudentProgress.findOne({
      where: { estudiante_id: estudianteId, juego_id: juegoId }
    });
    if (existing) {
      await existing.update({ completado: true, puntaje: Math.max(existing.puntaje, puntaje), fecha: new Date() });
      return { ...existing.toJSON(), wasExisting: true };
    }
    const record = await StudentProgress.create({
      estudiante_id: estudianteId,
      juego_id: juegoId,
      completado: true,
      puntaje: puntaje,
      fecha: new Date()
    });
    return { ...record.toJSON(), wasExisting: false };
  }

  static async registerEvaluationResult(estudianteId, evaluacionId, puntaje) {
    const existing = await StudentProgress.findOne({
      where: { estudiante_id: estudianteId, evaluacion_id: evaluacionId }
    });
    if (existing) {
      await existing.update({ completado: true, puntaje: Math.max(existing.puntaje, puntaje), fecha: new Date() });
      return { ...existing.toJSON(), wasExisting: true };
    }
    const record = await StudentProgress.create({
      estudiante_id: estudianteId,
      evaluacion_id: evaluacionId,
      completado: true,
      puntaje: puntaje,
      fecha: new Date()
    });
    return { ...record.toJSON(), wasExisting: false };
  }

  static async getDetailedProgress(estudianteId) {
    const rawContents = (await StudentProgress.findAll({
      where: { estudiante_id: estudianteId, contenido_id: { [Op.ne]: null } },
      include: [{ model: Content, as: 'contenido', required: false }]
    })).filter(r => r.contenido !== null);
    // Deduplicate: keep highest puntaje per contenido_id
    const contentsViewed = [...rawContents
      .reduce((map, r) => {
        const existing = map.get(r.contenido_id);
        if (!existing || r.puntaje > existing.puntaje) map.set(r.contenido_id, r);
        return map;
      }, new Map()).values()];

    const rawGames = (await StudentProgress.findAll({
      where: { estudiante_id: estudianteId, juego_id: { [Op.ne]: null } },
      include: [{ model: Game, as: 'juego', required: false }]
    })).filter(r => r.juego !== null);
    // Deduplicate: keep highest puntaje per juego_id
    const gamesCompleted = [...rawGames
      .reduce((map, r) => {
        const existing = map.get(r.juego_id);
        if (!existing || r.puntaje > existing.puntaje) map.set(r.juego_id, r);
        return map;
      }, new Map()).values()];

    const rawEvals = (await StudentProgress.findAll({
      where: { estudiante_id: estudianteId, evaluacion_id: { [Op.ne]: null } },
      include: [{ model: Evaluation, as: 'evaluacion', required: false }]
    })).filter(r => r.evaluacion !== null);
    // Deduplicate: keep highest puntaje per evaluacion_id
    const evaluationsCompleted = [...rawEvals
      .reduce((map, r) => {
        const existing = map.get(r.evaluacion_id);
        if (!existing || r.puntaje > existing.puntaje) map.set(r.evaluacion_id, r);
        return map;
      }, new Map()).values()];

    const progressByModule = await Progress.findAll({ where: { usuario_id: estudianteId } });

    return {
      contentsViewed,
      gamesCompleted,
      evaluationsCompleted,
      progressByModule
    };
  }
}

module.exports = StudentService;
