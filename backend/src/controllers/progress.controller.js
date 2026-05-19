const ProgressService = require('../services/progress.service');

class ProgressController {
  /**
   * Maneja la solicitud para obtener el progreso del estudiante que está logueado.
   * El ID del estudiante se extrae del token de seguridad (req.user.id).
   */
  static async obtenerMiProgreso(req, res) {
    try {
      // El middleware (verifyToken) debe haber colocado la info del usuario en req.user
      const usuarioId = req.user.id; 
      
      const progresos = await ProgressService.obtenerProgresoPorUsuario(usuarioId);
      
      res.status(200).json({
        success: true,
        data: progresos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Maneja la solicitud para que un profesor pueda ver el progreso de un estudiante específico.
   * El ID viene en la URL: /progreso/:estudianteId
   */
  static async obtenerProgresoPorEstudiante(req, res) {
    try {
      const { estudianteId } = req.params;
      
      const progresos = await ProgressService.obtenerProgresoPorUsuario(estudianteId);
      
      res.status(200).json({
        success: true,
        data: progresos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Endpoint para actualizar manualmente el progreso de un estudiante.
   * Nota: En producción, la actualización suele hacerse a nivel interno (Service a Service)
   * pero tener el endpoint HTTP es útil para integraciones o actualizaciones manuales.
   */
  static async actualizarProgresoHTTP(req, res) {
    try {
      const { usuarioId, modulo, puntosGanados, incrementoAvance } = req.body;

      if (!usuarioId || !modulo || puntosGanados === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Faltan parámetros obligatorios: usuarioId, modulo o puntosGanados.'
        });
      }

      const progresoActualizado = await ProgressService.actualizarProgreso(
        usuarioId, 
        modulo, 
        Number(puntosGanados), 
        Number(incrementoAvance) || 0
      );
      
      res.status(200).json({
        success: true,
        message: 'Progreso sincronizado exitosamente.',
        data: progresoActualizado
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ProgressController;
