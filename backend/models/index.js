const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./Course');
const Enrollment = require('./Enrollment');
const Lesson = require('./Lesson');
const Topic = require('./Topic');
const Flashcard = require('./Flashcard');
const Task = require('./Task');
const StudySession = require('./StudySession');

// ── Associations ──────────────────────────────────────

// User <-> Course (many-to-many via Enrollment)
User.belongsToMany(Course, { through: Enrollment, foreignKey: 'userId', as: 'courses' });
Course.belongsToMany(User, { through: Enrollment, foreignKey: 'courseId', as: 'users' });
Enrollment.belongsTo(User, { foreignKey: 'userId' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId' });

// Course -> Lessons
Course.hasMany(Lesson, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Lesson.belongsTo(Course, { foreignKey: 'courseId' });

// Lesson -> Topics
Lesson.hasMany(Topic, { foreignKey: 'lessonId', onDelete: 'CASCADE' });
Topic.belongsTo(Lesson, { foreignKey: 'lessonId' });

// Topic -> Flashcards
Topic.hasMany(Flashcard, { foreignKey: 'topicId', onDelete: 'CASCADE' });
Flashcard.belongsTo(Topic, { foreignKey: 'topicId' });

// User -> Tasks
User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

// User -> StudySessions
User.hasMany(StudySession, { foreignKey: 'userId', onDelete: 'CASCADE' });
StudySession.belongsTo(User, { foreignKey: 'userId' });
Topic.hasMany(StudySession, { foreignKey: 'topicId' });
StudySession.belongsTo(Topic, { foreignKey: 'topicId' });

module.exports = { sequelize, User, Course, Enrollment, Lesson, Topic, Flashcard, Task, StudySession };
