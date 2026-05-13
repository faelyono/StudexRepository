require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const { sequelize } = require('./models');
const errorHandler  = require('./middleware/errorHandler');

const app = express();

// ── Middleware ─────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/courses',     require('./routes/courses'));
app.use('/api/study',       require('./routes/study'));
app.use('/api/tasks',       require('./routes/tasks'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV }));
app.get('/', (req, res) => res.json({ status: 'server-online' }));

// ── Serve React build in production ────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
  );
}

// ── Error handler ──────────────────────────────────────
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // Start listening immediately so Railway's health check passes
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Studex server running on port ${PORT}`);
    });

    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected');

    await sequelize.sync(); // No 'alter: true' in production for speed
    console.log('✅ Database synced');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    // We don't exit(1) here so the server stays up for Railway, 
    // even if DB is temporarily down.
  }
})();
