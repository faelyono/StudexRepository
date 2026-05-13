/**
 * Gamification Service
 * All XP / level / streak / multiplier logic lives here.
 */

const BASE_XP_STUDY = 15;
const BASE_XP_TASK  = 10;

/**
 * Accuracy multiplier based on % correct
 */
function getAccuracyMultiplier(correctCount, totalCount) {
  if (totalCount === 0) return 1.0;
  const pct = (correctCount / totalCount) * 100;
  if (pct >= 90) return 2.0;
  if (pct >= 75) return 1.5;
  if (pct >= 50) return 1.2;
  return 1.0;
}

/**
 * Streak multiplier
 */
function getStreakMultiplier(streak) {
  if (streak >= 14) return 2.0;
  if (streak >= 7)  return 1.5;
  if (streak >= 3)  return 1.2;
  return 1.0;
}

/**
 * Calculate final XP for a study session
 */
function calcStudyXP(correctCount, totalCount, streak) {
  const accMult = getAccuracyMultiplier(correctCount, totalCount);
  const strMult = getStreakMultiplier(streak);
  const xpEarned = Math.round(BASE_XP_STUDY * accMult * strMult);
  return { xpEarned, accMult, strMult, totalMult: accMult * strMult };
}

/**
 * Calculate XP for completing a task (uses xpReward * streakMult)
 */
function calcTaskXP(xpReward, streak) {
  const strMult = getStreakMultiplier(streak);
  return Math.round(xpReward * strMult);
}

/**
 * Level from total XP: level = floor(xp / 100) + 1
 */
function getLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

/**
 * Update streak based on last login date.
 * Returns new streak value.
 */
function updateStreak(lastLoginDate, currentStreak) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!lastLoginDate) return 1;

  const last = new Date(lastLoginDate);
  last.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return currentStreak;        // same day, no change
  if (diffDays === 1) return currentStreak + 1;    // consecutive day
  return 1;                                         // streak broken → reset
}

module.exports = {
  BASE_XP_STUDY,
  BASE_XP_TASK,
  getAccuracyMultiplier,
  getStreakMultiplier,
  calcStudyXP,
  calcTaskXP,
  getLevel,
  updateStreak,
};
