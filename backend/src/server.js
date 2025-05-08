require('dotenv').config(); // Načíta .env súbor
console.log('Loaded ENV:', process.env.DB_NAME); // Debug výpis

const app = require('./app');
const sequelize = require('./config/database');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket.io logika
const { Message, User } = require('./models');

io.on('connection', (socket) => {
  // Očakávame, že klient po pripojení pošle svoj userId
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log('SOCKET: user joined room', `user_${userId}`);
  });

  // Prijatie správy
  socket.on('send_message', async (data) => {
    console.log('SOCKET: send_message', data);
    try {
      // Namiesto ukladania do DB len prepošli správu ako realtime notifikáciu
      // Očakávame, že správa už bola uložená cez HTTP POST a má id
      const message = {
        id: data.id,
        content: data.content,
        sender_id: data.senderId,
        receiver_id: data.receiverId,
        seen: 'false',
        created_at: data.created_at // voliteľne
      };
      // Odošli správu príjemcovi (ak je online)
      io.to(`user_${data.receiverId}`).emit('receive_message', message);
      // Odošli správu aj odosielateľovi (pre potvrdenie)
      io.to(`user_${data.senderId}`).emit('receive_message', message);
      console.log('SOCKET: emit to', `user_${data.receiverId}`, `user_${data.senderId}`);
    } catch (err) {
      console.error('Chyba pri realtime notifikácii správy:', err);
    }
  });
});

const chatRouter = require('./routes/chat');
app.use('/api/chat', chatRouter);

sequelize.sync().then(() => {
  server.listen(3000, () => console.log('Server beží na http://localhost:3000'));
});

app.use((req, res, next) => {
  console.log('MAIN SERVER REQUEST:', req.method, req.originalUrl);
  next();
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