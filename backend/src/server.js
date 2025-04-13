require('dotenv').config(); // Načíta .env súbor
console.log('Loaded ENV:', process.env.DB_NAME); // Debug výpis

const app = require('./app');
const sequelize = require('./config/database');

sequelize.sync().then(() => {
  app.listen(3000, () => console.log('Server beží na http://localhost:3000'));
});


/*
require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

// Test DB spojenia a synchronizácia modelov
sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    
    // Synchronizácia modelov s databázou
    return sequelize.sync({ alter: true }); // { force: true } pre reset DB
  })
  .then(() => {
    // Spustenie servera až po synchronizácii
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server beží na http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Chyba pri štarte:', err);
    process.exit(1);
  });*/