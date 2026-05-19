const StudentService = require('../services/student.service');
const Content = require('../models/content.model');
const Game = require('../models/game.model');
const Evaluation = require('../models/evaluation.model');
const StudentProgress = require('../models/studentProgress.model');
const ProgressService = require('../services/progress.service');

class StudentController {
  static async getDashboard(req, res) {
    try {
      const estudianteId = req.user.id;
      const data = await StudentService.getDashboardData(estudianteId);
      res.status(200).json({ success: true, data: { ...data, studentName: req.user.name } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getContenidosPublicados(req, res) {
    try {
      const contenidos = await Content.findAll({ where: { publicado: true } });
      res.status(200).json({ success: true, data: contenidos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getJuegosPublicados(req, res) {
    try {
      const juegos = await Game.findAll({ where: { publicado: true } });
      res.status(200).json({ success: true, data: juegos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getEvaluacionesPublicadas(req, res) {
    try {
      const evaluaciones = await Evaluation.findAll({ where: { publicado: true } });
      res.status(200).json({ success: true, data: evaluaciones });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async accederContenido(req, res) {
    try {
      const estudianteId = req.user.id;
      const { id } = req.params;
      const record = await StudentService.registerContentView(estudianteId, id);
      res.status(200).json({ success: true, message: 'Acceso registrado', data: record });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getProgresoDetallado(req, res) {
    try {
      const estudianteId = req.user.id;
      const data = await StudentService.getDetailedProgress(estudianteId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getDiagnostico(req, res) {
    try {
      const [contenidos, juegos, evaluaciones, progresoCount] = await Promise.all([
        Content.count({ where: { publicado: true } }),
        Game.count({ where: { publicado: true } }),
        Evaluation.count({ where: { publicado: true } }),
        require('../models/studentProgress.model').count({ where: { estudiante_id: req.user.id } })
      ]);
      res.status(200).json({ success: true, data: { contenidos, juegos, evaluaciones, progresoCount } });
    } catch (error) {
      res.status(200).json({ success: true, data: { contenidos: 0, juegos: 0, evaluaciones: 0, progresoCount: 0, error: error.message } });
    }
  }

  static async getCompletados(req, res) {
    try {
      const estudianteId = req.user.id;
      let records = [];
      try {
        records = await StudentProgress.findAll({
          where: { estudiante_id: estudianteId, completado: true }
        });
      } catch (dbErr) {
        console.warn('[getCompletados] Error consultando progreso_estudiante, retornando vacío:', dbErr.message);
      }
      const contenidos = records.filter(r => r && r.contenido_id).map(r => r.contenido_id);
      const juegos = records.filter(r => r && r.juego_id).map(r => r.juego_id);
      const evaluaciones = records.filter(r => r && r.evaluacion_id).map(r => r.evaluacion_id);
      res.status(200).json({ success: true, data: { contenidos, juegos, evaluaciones } });
    } catch (error) {
      res.status(200).json({ success: true, data: { contenidos: [], juegos: [], evaluaciones: [] } });
    }
  }
}

module.exports = StudentController;
