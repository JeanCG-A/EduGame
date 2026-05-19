const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/student.controller');
const RespuestasController = require('../controllers/respuestas.controller');
const { verifyToken, isStudent } = require('../middlewares/authMiddleware');

router.use(verifyToken);
router.use(isStudent);

router.get('/dashboard', StudentController.getDashboard);
router.get('/contenidos/publicados', StudentController.getContenidosPublicados);
router.post('/contenidos/:id/acceder', StudentController.accederContenido);
router.get('/juegos/publicados', StudentController.getJuegosPublicados);
router.post('/juegos/:id/responder', RespuestasController.responderJuego);
router.get('/evaluaciones/publicadas', StudentController.getEvaluacionesPublicadas);
router.post('/evaluaciones/:id/responder', RespuestasController.responderEvaluacion);
router.get('/progreso', StudentController.getProgresoDetallado);
router.get('/completados', StudentController.getCompletados);
router.get('/diagnostico', StudentController.getDiagnostico);

module.exports = router;
