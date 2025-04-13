//const cors = require('cors');
//app.use(cors()); // Povolí všetky žiadosti z frontendu

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRouter = require('./routes/Auth');
app.use('/api', authRouter);

const authRoutes = require('./routes/Auth');
const activityRoutes = require('./routes/activities');

app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes); // Pridané

const imageRoutes = require('./routes/images');
// ...
app.use('/api/images', imageRoutes);

const roleRoutes = require('./routes/roles');
// ...
app.use('/api/roles', roleRoutes);

module.exports = app;