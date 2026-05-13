const { StudySession, User, Topic } = require('../models');
const { calcStudyXP, getLevel } = require('../services/gamificationService');

// POST /study/complete
exports.completeSession = async (req, res, next) => {
  try {
    const { topicId, correctCount, totalCount } = req.body;
    if (topicId == null || correctCount == null || totalCount == null) {
      return res.status(400).json({ message: 'topicId, correctCount, totalCount required' });
    }

    const topic = await Topic.findByPk(topicId);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    const user = await User.findByPk(req.user.id);
    const { xpEarned, accMult, strMult, totalMult } = calcStudyXP(correctCount, totalCount, user.streak);

    const newXP    = user.xp + xpEarned;
    const newLevel = getLevel(newXP);

    await user.update({ xp: newXP, level: newLevel });

    await StudySession.create({
      userId: user.id,
      topicId,
      correctCount,
      totalCount,
      multiplierUsed: totalMult,
      xpEarned,
    });

    res.json({
      xpEarned,
      accMult,
      strMult,
      newXP,
      newLevel,
      message: `+${xpEarned} XP earned`,
    });
  } catch (err) { next(err); }
};
