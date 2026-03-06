// CREATE APP.JS
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routers/auth.router');
const userRoutes = require('./routers/user.router');
const serviceRoutes = require('./routers/service.router');
const orderRoutes = require('./routers/order.router');
const reviewRoutes = require('./routers/review.router');

const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');
// CREATE SERVER
const app = express();

// CORS
app.use(cors());

// PUBLIC DIRECTORY
app.use(express.static('public'));

// JSON
app.use(express.json());

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// ERROR HANDLER    
app.use(errorHandler);

// NOT FOUND
app.use(notFound);

module.exports = app;