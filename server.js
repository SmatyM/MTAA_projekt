require('dotenv').config();
const express = require('express');
const cors = require('cors');
const messageRoutes = require('./routes/messages');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/messages', messageRoutes);

app.get('/', (req, res) => res.send('Marek backend bezi :)'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
