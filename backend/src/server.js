require('dotenv').config(); // Cargamos variables de entorno al iniciar
const app = require('./app');
const { testConnection } = require('./config/database');

// Tomamos el puerto desde las variables de entorno o usamos el 3000 por defecto
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 1. Verificamos la conexión a la base de datos MySQL
    await testConnection();
    
    // Sincronizar los modelos con la base de datos (Crea las tablas si no existen)
    const { sequelize } = require('./config/database');
    // Cargar asociaciones entre modelos
    require('./models/associations');
    await sequelize.sync({ alter: true });
    console.log('📦 Tablas sincronizadas con la base de datos.');

    // 2. Si la conexión a DB fue exitosa, levantamos el servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend de EduApp corriendo en http://localhost:${PORT}`);
      console.log(`✅ Prueba la API en: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Error crítico al iniciar el servidor:', error);
    process.exit(1); // Detiene la ejecución si hay un error grave
  }
};

startServer();
