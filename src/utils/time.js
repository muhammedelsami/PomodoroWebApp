export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatMinutes = (seconds) => Math.floor(seconds / 60);

export const todayKey = () => new Date().toISOString().slice(0, 10);
