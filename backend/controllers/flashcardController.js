const { Flashcard, Topic } = require('../models');

// GET /courses/topics/:topicId/flashcards
exports.getCards = async (req, res, next) => {
  try {
    const topic = await Topic.findByPk(req.params.topicId);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    const cards = await Flashcard.findAll({ where: { topicId: req.params.topicId } });
    res.json(cards);
  } catch (err) { next(err); }
};

// POST /flashcards  (admin use / seeder)
exports.createCard = async (req, res, next) => {
  try {
    const { topicId, question, answer } = req.body;
    if (!topicId || !question || !answer) return res.status(400).json({ message: 'topicId, question, answer required' });
    const card = await Flashcard.create({ topicId, question, answer });
    res.status(201).json(card);
  } catch (err) { next(err); }
};
