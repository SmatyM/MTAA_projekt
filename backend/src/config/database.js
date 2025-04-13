/*const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
});
module.exports = sequelize;*/



const { Sequelize } = require('sequelize');

// Debug výpis
console.log('Database config:', {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST
});

const sequelize = new Sequelize(
  process.env.DB_NAME || 'fiitness_db', // Fallback hodnota
  process.env.DB_USER || 'postgres', 
  process.env.DB_PASSWORD || '12345',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: false
    }
  }
);

module.exports = sequelize;