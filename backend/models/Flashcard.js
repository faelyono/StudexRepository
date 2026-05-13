const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Flashcard = sequelize.define('Flashcard', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  topicId: { type: DataTypes.INTEGER, allowNull: false },
  question: { type: DataTypes.TEXT, allowNull: false },
  answer: { type: DataTypes.TEXT, allowNull: false },
}, { timestamps: false });

module.exports = Flashcard;
