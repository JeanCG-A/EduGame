const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes'); // Automáticamente buscará el index.js dentro de routes/

const app = express();

// --- MIDDLEWARES GLOBALES ---
// Habilita peticiones cruzadas desde el frontend (React)
app.use(cors());

// Permite a Express entender cuerpos de peticiones en formato JSON (ej. req.body)
app.use(express.json());

// Permite a Express entender datos enviados desde formularios tradicionales
app.use(express.urlencoded({ extended: true }));


// --- RUTAS ---
// Todas las rutas definidas en routes/index.js tendrán el prefijo /api
app.use('/api', apiRoutes);


// --- MANEJO DE ERRORES BÁSICO ---
// Si alguna ruta falla o lanza un throw, caerá aquí
app.use((err, req, res, next) => {
  console.error('[Error no manejado]:', err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor',
  });
});

module.exports = app;
