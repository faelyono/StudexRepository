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
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected');

    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');

    app.listen(PORT, () => {
      console.log(`🚀 Studex server running on http://localhost:${PORT}`);
      console.log(`   API base: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
})();
