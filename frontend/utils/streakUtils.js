export const calculateStreak = (history = []) => {
  if (!history || history.length === 0) return 0;
  return history.length;
};

export const getStreakBadge = (streakCount = 0) => {
  if (streakCount >= 30) return '🔥 Master';
  if (streakCount >= 14) return '⚡ Champion';
  if (streakCount >= 7) return '🌟 Pro';
  if (streakCount >= 3) return '🌱 Rising';
  return '✨ Starter';
};
