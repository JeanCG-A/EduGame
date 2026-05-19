const EvaluationService = require('../services/evaluation.service');

class EvaluationController {
  /**
   * Maneja la solicitud para crear una evaluación y sus preguntas.
   */
  static async crearEvaluacion(req, res) {
    try {
      const data = req.body;
      const nuevaEvaluacion = await EvaluationService.crearEvaluacion(data);
      
      res.status(201).json({
        success: true,
        message: 'Evaluación y preguntas creadas exitosamente',
        data: nuevaEvaluacion
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Maneja la solicitud para actualizar una evaluación existente.
   */
  static async actualizarEvaluacion(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const evaluacionActualizada = await EvaluationService.actualizarEvaluacion(id, data);

      res.status(200).json({
        success: true,
        message: 'Evaluación actualizada correctamente',
        data: evaluacionActualizada
      });
    } catch (error) {
      if (error.message.includes('no encontrada')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Maneja la solicitud para obtener todas las evaluaciones.
   */
  static async obtenerEvaluaciones(req, res) {
    try {
      const filtros = req.query;
      const evaluaciones = await EvaluationService.obtenerEvaluaciones(filtros);
      
      res.status(200).json({
        success: true,
        data: evaluaciones
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

 static async eliminarEvaluacion(req, res) {
    try {
      const { id } = req.params;
      const evaluacionEliminada = await EvaluationService.eliminarEvaluacion(id);

      res.status(200).json({
        success: true,
        message: 'Evaluación eliminada correctamente',
        data: evaluacionEliminada
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Maneja la solicitud para obtener una evaluación específica con sus preguntas.
   */
  static async obtenerEvaluacionPorId(req, res) {
    try {
      const { id } = req.params;
      const evaluacion = await EvaluationService.obtenerEvaluacionPorId(id);
      
      // Opcional: Podríamos mapear la evaluación aquí para no devolver la "respuesta_correcta"
      // al frontend antes de que el estudiante responda, para evitar trampas.
      
      res.status(200).json({
        success: true,
        data: evaluacion
      });
    } catch (error) {
      if (error.message.includes('no encontrada')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Maneja la solicitud de un estudiante al enviar sus respuestas para ser calificadas.
   */
  static async responderEvaluacion(req, res) {
    try {
      const { id } = req.params;
      const { respuestas } = req.body; // Esperamos { respuestas: [{ pregunta_id: 1, respuesta: 'a' }] }

      if (!respuestas || !Array.isArray(respuestas)) {
        return res.status(400).json({
          success: false,
          message: 'Debe enviar un arreglo de "respuestas" válido en el cuerpo de la petición.'
        });
      }

      // El servicio procesa todo sin que el controlador toque la base de datos
      const resultado = await EvaluationService.responderEvaluacion(id, respuestas);
      
      res.status(200).json({
        success: true,
        message: 'Evaluación calificada exitosamente',
        data: resultado // Incluye el puntaje base 100 y el detalle pregunta a pregunta
      });
    } catch (error) {
      if (error.message.includes('no encontrada')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = EvaluationController;
