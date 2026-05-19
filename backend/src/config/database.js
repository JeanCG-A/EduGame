const { Sequelize } = require('sequelize');


// Recomiendo Sequelize porque se integra de forma excelente con Node, MySQL y arquitectura MVC.
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306, // 👈 IMPORTANTE
    dialect: 'mysql',
    logging: false,
  }
);


const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos MySQL establecida correctamente.');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
  }
};

module.exports = { sequelize, testConnection };
