export default function obtainLocaleDayTime(date) {
  const hour = new Date(date).getHours();

  if (hour >= 7 && hour <= 20) {
    return 'day';
  }
  return 'night';
}
