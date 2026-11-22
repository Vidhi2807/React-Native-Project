export const calculatePercentage = (current = 0, target = 100) => {
  if (!target || target <= 0) return 0;
  const pct = Math.round((current / target) * 100);
  return Math.min(Math.max(pct, 0), 100);
};

export const getProgressColor = (percentage) => {
  if (percentage >= 100) return '#10B981'; // success
  if (percentage >= 60) return '#6366F1';  // primary
  if (percentage >= 30) return '#F59E0B';  // warning
  return '#EF4444'; // danger
};
