const { User, Enrollment } = require('../models');

const format = (users) =>
  users.map(u => ({
    id: u.id, name: u.name, xp: u.xp, level: u.level, streak: u.streak,
  }));

// GET /leaderboard/global
exports.getGlobal = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'xp', 'level', 'streak'],
      order: [['xp', 'DESC']],
      limit: 50,
    });
    res.json(format(users));
  } catch (err) { next(err); }
};

// GET /leaderboard/course/:id
exports.getCourse = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { courseId: req.params.id },
      include: [{
        model: User,
        attributes: ['id', 'name', 'xp', 'level', 'streak'],
      }],
    });

    const users = enrollments
      .map(e => e.User)
      .filter(Boolean)
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 50);

    res.json(format(users));
  } catch (err) { next(err); }
};
