const { Task, User } = require('../models');
const { calcTaskXP, getLevel } = require('../services/gamificationService');

// GET /tasks
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(tasks);
  } catch (err) { next(err); }
};

// POST /tasks
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, xpReward, courseId } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const task = await Task.create({
      userId: req.user.id,
      courseId: courseId || null,
      title,
      description: description || '',
      dueDate: dueDate || null,
      xpReward: xpReward || 10,
    });
    res.status(201).json(task);
  } catch (err) { next(err); }
};

// PUT /tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, description, dueDate, xpReward } = req.body;
    await task.update({ title, description, dueDate, xpReward });
    res.json(task);
  } catch (err) { next(err); }
};

// DELETE /tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (err) { next(err); }
};

// PATCH /tasks/:id/complete
exports.completeTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.status === 'done') return res.status(400).json({ message: 'Task already completed' });

    const user = await User.findByPk(req.user.id);
    const xpGained = calcTaskXP(task.xpReward, user.streak);
    const newXP    = user.xp + xpGained;
    const newLevel = getLevel(newXP);

    await task.update({ status: 'done' });
    await user.update({ xp: newXP, level: newLevel });

    res.json({ message: `Task completed! +${xpGained} XP`, xpGained, newXP, newLevel });
  } catch (err) { next(err); }
};
