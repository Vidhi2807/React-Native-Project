export const formatDate = (date = new Date()) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (date = new Date()) => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const getIsoDate = (date = new Date()) => {
  return new Date(date).toISOString().split('T')[0];
};

export const isToday = (dateString) => {
  const today = getIsoDate(new Date());
  return dateString === today;
};
