module.exports = (err, req, res, next) => {
  console.error('[ERROR]', err.message);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ message: err.errors[0].message });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
};
