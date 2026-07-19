const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const organizerRoutes = require('./routes/organizerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',');
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'EventSphere API is running' }));

app.use('/api/users', userRoutes);
app.use('/api/organizers', organizerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
