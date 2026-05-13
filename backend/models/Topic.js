const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Topic = sequelize.define('Topic', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  lessonId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { timestamps: false });

module.exports = Topic;
