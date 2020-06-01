import obtainLocaleSeason from '../src/js/LocationInfo/obtainLocaleSeason';

describe('obtainLocaleSeason', () => {
  it ('should return "summer" for lat > 0 and 1591041477138 as date value', () => {
    const date = 1591041477138;
    const currentLat = 54.7430600;
    expect(obtainLocaleSeason(date, currentLat)).toEqual('summer');
  });
  it ('should return "winter" for lat < 0 and 1591041477138 as date value', () => {
    const date = 1591041477138;
    const currentLat = -54.7430600;
    expect(obtainLocaleSeason(date, currentLat)).toEqual('winter');
  });
  it ('should return ', () => {
    const date = 1591041477138;
    const currentLat = null;
    expect(obtainLocaleSeason(date)).toEqual('Can`t find season');
  });
});
