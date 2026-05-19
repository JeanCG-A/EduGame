const express = require('express');
const router = express.Router();
const ContentController = require('../controllers/content.controller');
const { verifyToken, isTeacher } = require('../middlewares/authMiddleware');

// Ruta pública para obtener módulos (con auth, pero no exclusivo de docente)
router.get('/modulos', verifyToken, ContentController.obtenerModulos);

// Middleware JWT global para estas rutas (todos deben estar autenticados)
router.use(verifyToken);

// Rutas de lectura (disponibles para estudiantes y docentes)
router.get('/', ContentController.obtenerContenidos);
router.get('/:id', ContentController.obtenerContenidoPorId);

// Rutas de escritura y eliminación (protegidas solo para docentes)
router.post('/', isTeacher, ContentController.crearContenido);
router.put('/:id', isTeacher, ContentController.actualizarContenido);
router.delete('/:id', isTeacher, ContentController.eliminarContenido);

module.exports = router;
