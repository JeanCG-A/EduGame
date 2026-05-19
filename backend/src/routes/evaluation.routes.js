const express = require('express');
const router = express.Router();
const EvaluationController = require('../controllers/evaluation.controller');
const { verifyToken, isTeacher, isStudent } = require('../middlewares/authMiddleware');

// Middleware global para verificar que el usuario tenga un token válido
router.use(verifyToken);

// =======================
// RUTAS DE EVALUACIONES
// =======================

// Obtener todas las evaluaciones (disponible para estudiantes y docentes)
router.get('/', EvaluationController.obtenerEvaluaciones);

// Obtener una evaluación por su ID (disponible para estudiantes y docentes)
router.get('/:id', EvaluationController.obtenerEvaluacionPorId);

// Crear nueva evaluación con sus preguntas (SOLO DOCENTES)
router.post('/', isTeacher, EvaluationController.crearEvaluacion);

// Actualizar una evaluación existente (SOLO DOCENTES)
router.put('/:id', isTeacher, EvaluationController.actualizarEvaluacion);

// Eliminar una evaluación (SOLO DOCENTES)
router.delete('/:id', isTeacher, EvaluationController.eliminarEvaluacion);

module.exports = router;
