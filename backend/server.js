require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (if you serve uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth/admin', require('./routes/adminAuth'));      // Admin login
app.use('/auth/organizer', require('./routes/organizerAuth')); // Organizer register/login
app.use('/auth/user', require('./routes/userAuth'));          // User register/login
app.use('/admin', require('./routes/admin'));                 // Admin dashboard APIs
app.use('/events', require('./routes/events'));               // Public event browse
app.use('/users', require('./routes/users'));                 // User bookings & profile
app.use('/organizers', require('./routes/organizers'));       // Organizer dashboard APIs
app.use('/payments', require('./routes/payments'));           // Payment webhooks/stuff

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});