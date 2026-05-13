const { Course, Enrollment, Lesson, Topic, User } = require('../models');

// GET /courses — all courses, with enrolled flag for current user
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.findAll({ order: [['id', 'ASC']] });

    const enrollments = await Enrollment.findAll({ where: { userId: req.user.id } });
    const enrolledIds = new Set(enrollments.map(e => e.courseId));

    const result = courses.map(c => ({
      ...c.toJSON(),
      enrolled: enrolledIds.has(c.id),
    }));

    res.json(result);
  } catch (err) { next(err); }
};

// POST /courses/enroll/:courseId
exports.enroll = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const existing = await Enrollment.findOne({ where: { userId: req.user.id, courseId } });
    if (existing) return res.status(409).json({ message: 'Already enrolled' });

    await Enrollment.create({ userId: req.user.id, courseId });
    res.status(201).json({ message: 'Enrolled successfully', courseId });
  } catch (err) { next(err); }
};

// GET /courses/:id/lessons  — lessons with their topics nested
exports.getLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.findAll({
      where: { courseId: req.params.id },
      include: [{ model: Topic, order: [['order', 'ASC']] }],
      order: [['order', 'ASC']],
    });
    res.json(lessons);
  } catch (err) { next(err); }
};
