const express = require('express');
const router = express.Router();
const GameController = require('../controllers/game.controller');
const { verifyToken, isTeacher, isStudent } = require('../middlewares/authMiddleware');

// Middleware JWT global para proteger todas las rutas de este módulo
router.use(verifyToken);

// =======================
// RUTAS DE JUEGOS
// =======================

// Lectura: Disponibles para cualquier usuario autenticado (estudiantes y docentes)
router.get('/', GameController.obtenerJuegos);
router.get('/:id', GameController.obtenerJuegoPorId);

// Escritura: Solo el docente puede crear y configurar la lógica de nuevos juegos
router.post('/', isTeacher, GameController.crearJuego);
router.put('/:id', isTeacher, GameController.actualizarJuego);
router.delete('/:id', isTeacher, GameController.eliminarJuego);

module.exports = router;
