export default function obtainLocaleSeason(date, lat) {
  const month = new Date(date).getMonth();

  if (lat >= 0) {
    switch (month) {
      case 11:
      case 0:
      case 1:
        return 'winter';
      case 2:
      case 3:
      case 4:
        return 'spring';
      case 5:
      case 6:
      case 7:
        return 'summer';
      case 8:
      case 9:
      case 10:
        return 'autumn';
      default:
    }
  } else {
    switch (month) {
      case 11:
      case 0:
      case 1:
        return 'summer';
      case 2:
      case 3:
      case 4:
        return 'autumn';
      case 5:
      case 6:
      case 7:
        return 'winter';
      case 8:
      case 9:
      case 10:
        return 'spring';
      default:
    }
  }
  return false;
}
