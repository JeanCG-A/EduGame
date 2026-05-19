const Evaluation = require('../models/evaluation.model');
const Question = require('../models/question.model');
const { sequelize } = require('../config/database');

class EvaluationService {
  /**
   * Crea una nueva evaluación junto con sus preguntas.
  
   * @param {Object} data - Datos (ej: { titulo: '...', preguntas: [{enunciado: '...', opciones: {A: '...'}}] })
   */
  static async crearEvaluacion(data) {
    // Iniciamos una transacción de Sequelize
    const t = await sequelize.transaction();
    try {
      // Extraemos las preguntas y las transformamos al formato del modelo
      const { preguntas, ...evaluacionData } = data;
      
      console.log('📋 Datos recibidos:', JSON.stringify(data, null, 2));
      console.log('❓ Preguntas recibidas:', preguntas);
      
      // Creamos la evaluación primero
      const nuevaEvaluacion = await Evaluation.create(evaluacionData, { transaction: t });
      
      // Si hay preguntas, las creamos
      if (preguntas && preguntas.length > 0) {
        const preguntasFormateadas = preguntas.map((pregunta, index) => {
          console.log(`📝 Pregunta ${index}:`, JSON.stringify(pregunta, null, 2));
          
          return {
            evaluacion_id: nuevaEvaluacion.id,
            pregunta: pregunta.enunciado || '',
            opcion_a: pregunta.opciones?.A || '',
            opcion_b: pregunta.opciones?.B || '',
            opcion_c: pregunta.opciones?.C || '',
            opcion_d: pregunta.opciones?.D || '',
            respuesta_correcta: pregunta.respuestaCorrecta?.toLowerCase() || ''
          };
        });
        
        console.log('✅ Preguntas formateadas:', JSON.stringify(preguntasFormateadas, null, 2));
        
        await Question.bulkCreate(preguntasFormateadas, { transaction: t });
      }
      
      await t.commit();
      return nuevaEvaluacion;
    } catch (error) {
      await t.rollback();
      console.error('❌ Error en crearEvaluacion:', error);
      throw new Error(`Error al crear la evaluación: ${error.message}`);
    }
  }

  /**
   * Actualiza una evaluación existente y sus preguntas si se envían.
   */
  static async actualizarEvaluacion(id, data) {
    const t = await sequelize.transaction();
    try {
      const { preguntas, ...evaluacionData } = data;
      const evaluacion = await Evaluation.findByPk(id, { transaction: t });

      if (!evaluacion) {
        throw new Error('Evaluación no encontrada');
      }
      // Si la evaluación ya está publicada, solo permitimos "despublicarla" (cambiar publicado a false)
      // No permitimos editar otros campos mientras esté publicada.
      if (evaluacion.publicado) {
        const isOnlyPublishChange = Object.keys(data).length === 1 && data.publicado !== undefined;
        
        if (isOnlyPublishChange) {
          await evaluacion.update({ publicado: data.publicado }, { transaction: t });
          await t.commit();
          return evaluacion;
        }
        throw new Error('No se puede modificar una evaluación que ya está publicada.');
      }
      await evaluacion.update(evaluacionData, { transaction: t });

      if (preguntas && Array.isArray(preguntas)) {
        await Question.destroy({ where: { evaluacion_id: id }, transaction: t });

        const preguntasFormateadas = preguntas.map((pregunta) => ({
          evaluacion_id: evaluacion.id,
          pregunta: pregunta.enunciado || '',
          opcion_a: pregunta.opciones?.A || '',
          opcion_b: pregunta.opciones?.B || '',
          opcion_c: pregunta.opciones?.C || '',
          opcion_d: pregunta.opciones?.D || '',
          respuesta_correcta: pregunta.respuestaCorrecta?.toLowerCase() || ''
        }));
        if (preguntasFormateadas.length > 0) {
          await Question.bulkCreate(preguntasFormateadas, { transaction: t });
        }
      }

      await t.commit();

      return await Evaluation.findByPk(id, {
        include: [{
          model: Question,
          as: 'preguntas'
        }]
      });
    } catch (error) {
      await t.rollback();
      throw new Error(`Error al actualizar la evaluación: ${error.message}`);
    }
  }

  /**
   * Obtiene la lista de evaluaciones.
   * @param {Object} filtros - Filtros opcionales (ej: { modulo: 'Matemáticas' })
   */
  static async obtenerEvaluaciones(filtros = {}) {
    try {
      const evaluaciones = await Evaluation.findAll({
        where: filtros
      });
      return evaluaciones;
    } catch (error) {
      throw new Error(`Error al obtener evaluaciones: ${error.message}`);
    }
  }

  /**
   * Obtiene una evaluación por su ID y carga todas sus preguntas asociadas.
   */
  static async obtenerEvaluacionPorId(id) {
    try {
      const evaluacion = await Evaluation.findByPk(id, {
        include: [{
          model: Question,
          as: 'preguntas'
        }]
      });
      
      if (!evaluacion) {
        throw new Error('Evaluación no encontrada');
      }
      return evaluacion;
    } catch (error) {
      throw new Error(`Error al obtener la evaluación: ${error.message}`);
    }
  }

  static async eliminarEvaluacion(id) {
    try {
      const evaluacion = await Evaluation.findByPk(id);
      if (!evaluacion) {
        throw new Error('Evaluación no encontrada');
      }
      await evaluacion.destroy();
      return evaluacion;
    } catch (error) {
      throw new Error(`Error al eliminar la evaluación: ${error.message}`);
    }
  }

  /**
   * Recibe las respuestas enviadas por un estudiante, las valida contra la BD y calcula un puntaje.
   * @param {number} evaluacionId - ID de la evaluación
   * @param {Array} respuestasUsuario - [{ pregunta_id: 1, respuesta: 'a' }, { pregunta_id: 2, respuesta: 'c' }]
   * @returns {Object} Resultado con puntaje final y detalle de cada pregunta.
   */
  static async responderEvaluacion(evaluacionId, respuestasUsuario) {
    try {
      // 1. Obtener la evaluación con las respuestas correctas de la base de datos
      const evaluacion = await Evaluation.findByPk(evaluacionId, {
        include: [{
          model: Question,
          as: 'preguntas'
        }]
      });

      if (!evaluacion) {
        throw new Error('Evaluación no encontrada');
      }

      const preguntasBD = evaluacion.preguntas;
      let cantidadCorrectas = 0;
      const totalPreguntas = preguntasBD.length;

      // 2. Evaluamos cada pregunta
      const detalle = preguntasBD.map(preguntaBD => {
        // Buscamos qué respondió el usuario para esta pregunta específica
        const respuestaEnviada = respuestasUsuario.find(r => r.pregunta_id === preguntaBD.id);
        const fueRespondida = !!respuestaEnviada;
        
        let esCorrecta = false;
        if (fueRespondida) {
          // Comparamos sin importar mayúsculas/minúsculas (ej: 'a' vs 'A')
          esCorrecta = respuestaEnviada.respuesta.toLowerCase() === preguntaBD.respuesta_correcta.toLowerCase();
          if (esCorrecta) {
            cantidadCorrectas++;
          }
        }

        return {
          pregunta_id: preguntaBD.id,
          respondida: fueRespondida,
          respuesta_enviada: fueRespondida ? respuestaEnviada.respuesta : null,
          es_correcta: esCorrecta,
          // Opcional: devolvemos la respuesta correcta para que el estudiante vea en qué falló
          respuesta_correcta: preguntaBD.respuesta_correcta 
        };
      });

      // 3. Calcular puntaje (ejemplo: base 100)
      const puntajeFinal = totalPreguntas > 0 ? Math.round((cantidadCorrectas / totalPreguntas) * 100) : 0;

      // 4. Retornar los resultados analizados
      return {
        evaluacion_id: evaluacion.id,
        total_preguntas: totalPreguntas,
        respuestas_correctas: cantidadCorrectas,
        puntaje: puntajeFinal, 
        detalle: detalle
      };
    } catch (error) {
      throw new Error(`Error al procesar respuestas de la evaluación: ${error.message}`);
    }
  }
}

module.exports = EvaluationService;
