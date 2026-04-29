require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const passport = require('./config/passport');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const memberRoutes = require('./routes/members');
const transactionRoutes = require('./routes/transactions');
const reservationRoutes = require('./routes/reservations');
const fineRoutes = require('./routes/fines');
const categoryRoutes = require('./routes/categories');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Connect Database
connectDB();

// Security Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Rate Limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests, please try again later.' });
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Sessions (for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/fines', fineRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '📚 LibraVault API is running!', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🚀 LibraVault Server running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`🌐 Client: ${process.env.CLIENT_URL}`);
    console.log(`🔐 Google OAuth: Enabled\n`);
  });
}

module.exports = app;
