const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudySession = sequelize.define('StudySession', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  topicId: { type: DataTypes.INTEGER, allowNull: false },
  correctCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  multiplierUsed: { type: DataTypes.FLOAT, defaultValue: 1.0 },
  xpEarned: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = StudySession;
