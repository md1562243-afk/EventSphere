export function formatTime12hr(timeString) {
  if (!timeString) return '';
  const [hourStr, minuteStr] = timeString.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute} ${period}`;
}