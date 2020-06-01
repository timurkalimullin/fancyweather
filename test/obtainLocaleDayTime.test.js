import obtainLocaleDayTime from '../src/js/LocationInfo/obtainLocaleDayTime';

describe('obtainLocaleSeason', () => {
  it ('should return "night" for "Jan 02 2020 01:14:29"', () => {
    const date = 'Jan 02 2020 01:14:29';
    expect(obtainLocaleDayTime(date)).toEqual('night');
  });
  it ('should return "day" for "Jan 02 1985 12:14:29"', () => {
    const date = 'Jan 02 2020 12:14:29';
    expect(obtainLocaleDayTime(date)).toEqual('day');
  });
});
