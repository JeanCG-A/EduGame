const express = require('express');
const router = express.Router();
const ProgressController = require('../controllers/progress.controller');
const { verifyToken, isStudent } = require('../middlewares/authMiddleware');

// 1. Verificamos que exista un Token válido
router.use(verifyToken);

// 2. Verificamos que el usuario autenticado sea un Estudiante
router.use(isStudent);

// =======================
// RUTAS DE PROGRESO
// =======================

// Obtener el progreso del estudiante logueado
router.get('/', ProgressController.obtenerMiProgreso);

// Actualizar el progreso (ej. tras finalizar una lección sin mini-juego evaluado)
// Se utiliza PUT de acuerdo a la semántica solicitada
router.put('/', ProgressController.actualizarProgresoHTTP);

module.exports = router;
