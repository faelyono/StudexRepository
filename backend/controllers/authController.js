const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { getLevel, updateStreak } = require('../services/gamificationService');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const safeUser = (u) => ({
  id: u.id, name: u.name, email: u.email,
  xp: u.xp, level: u.level, streak: u.streak,
});

// POST /auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const today = new Date().toISOString().split('T')[0];
    const user = await User.create({ name, email, password: hashed, streak: 1, lastLoginDate: today });

    res.status(201).json({ token: signToken(user.id), user: safeUser(user) });
  } catch (err) { next(err); }
};

// POST /auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    // Update streak
    const today = new Date().toISOString().split('T')[0];
    const newStreak = updateStreak(user.lastLoginDate, user.streak);
    await user.update({ streak: newStreak, lastLoginDate: today });

    res.json({ token: signToken(user.id), user: safeUser(user) });
  } catch (err) { next(err); }
};

// GET /auth/me
exports.getMe = async (req, res) => {
  res.json({ user: safeUser(req.user) });
};
