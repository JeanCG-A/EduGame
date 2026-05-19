const Progress = require('../models/progress.model');

class ProgressService {
  /**
   * Función interna para calcular el nivel del estudiante según sus puntos.
   * Lógica de ejemplo: Cada 500 puntos el usuario sube 1 nivel.
   * @param {number} puntajeTotal - El puntaje histórico acumulado.
   * @returns {number} El nivel correspondiente.
   */
  static calcularNivel(puntajeTotal) {
    // Ejemplo: 
    // 0 - 499 puntos = Nivel 1
    // 500 - 999 puntos = Nivel 2
    // 1000 - 1499 puntos = Nivel 3...
    const puntosPorNivel = 500;
    const nivel = Math.floor(puntajeTotal / puntosPorNivel) + 1;
    return nivel;
  }

  /**
   * Obtiene todos los registros de progreso de un estudiante específico.
   * @param {number|string} usuarioId - ID del estudiante.
   * @returns {Promise<Array>} Lista con el progreso en cada módulo.
   */
  static async obtenerProgresoPorUsuario(usuarioId) {
    try {
      const progresos = await Progress.findAll({
        where: { usuario_id: usuarioId }
      });
      return progresos;
    } catch (error) {
      throw new Error(`Error al obtener el progreso del usuario: ${error.message}`);
    }
  }

  /**
   * Actualiza el progreso de un estudiante en un módulo específico.
   * Ideal para ser llamado al finalizar un "Juego" o una "Evaluación".
   * 
   * @param {number} usuarioId - ID del estudiante.
   * @param {string} modulo - Nombre del módulo donde jugó/evaluó (ej: 'Matemáticas').
   * @param {number} puntosGanados - Puntos a sumar (calculados del juego o evaluación).
   * @param {number} incrementoAvance - Porcentaje de avance a sumar (ej: 5.5%).
   * @returns {Promise<Object>} El progreso actualizado.
   */
  static async actualizarProgreso(usuarioId, modulo, puntosGanados, incrementoAvance = 0) {
    try {
      // 1. Buscamos si el estudiante ya empezó este módulo previamente
      let progreso = await Progress.findOne({
        where: { 
          usuario_id: usuarioId, 
          modulo: modulo 
        }
      });

      if (!progreso) {
        // 2a. Si no existe, es la primera vez que hace algo en este módulo. Lo creamos.
        progreso = await Progress.create({
          usuario_id: usuarioId,
          modulo: modulo,
          puntaje_total: puntosGanados,
          nivel: this.calcularNivel(puntosGanados),
          porcentaje_avance: incrementoAvance
        });
      } else {
        // 2b. Si ya existe, acumulamos los puntos y el avance
        const nuevoPuntaje = progreso.puntaje_total + puntosGanados;
        
        // Parseamos a float porque DECIMAL viene como string de MySQL
        let nuevoAvance = parseFloat(progreso.porcentaje_avance) + incrementoAvance;
        
        // Lógica de validación: el módulo no puede pasar de 100% de avance
        if (nuevoAvance > 100) {
          nuevoAvance = 100;
        }

        // Actualizamos en BD
        await progreso.update({
          puntaje_total: nuevoPuntaje,
          nivel: this.calcularNivel(nuevoPuntaje), // Se recalcula si subió de nivel
          porcentaje_avance: nuevoAvance,
          ultima_actividad: new Date() // Actualizamos explícitamente la fecha
        });
      }

      return progreso;
    } catch (error) {
      throw new Error(`Error al actualizar el progreso: ${error.message}`);
    }
  }
}

module.exports = ProgressService;
