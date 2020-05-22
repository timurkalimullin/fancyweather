import './styles/scss.scss';

import obtainIPInfo from './js/obtainIPInfo';
import obtainWeather from './js/obtainWeather';
import { obtainGeoDatafromPlaceName, obtainGeoDatafromCoord } from './js/obtainGeoData';
import obtainLocaleTime from './js/obtainLocaleTime';
import parseWeatherParametres from './js/parseWeatherParametres';

const apiKeyIPInfo = 'ad4cb296462880';
const apiKeyWeather = 'df8d41cc3412c9b1ac992d87f6fa81d3';
const apiKeyGeoData = '5f01a3a9d68f415c94ad261794e7fae4';

class App {
  constructor() {
    this.coord = null;
    this.lang = 'en';
    this.timeOffset = null;
    this.placeName = null;
  }

  async getUserCoordinates() {
    const userIPInfo = await obtainIPInfo(apiKeyIPInfo);
    const userLocation = await userIPInfo.loc.split(',');
    this.coord = {
      lat: userLocation[0],
      lng: userLocation[1],
    };
  }

  formOutputData(data) {
    const ms = 1000; /* milliseconds in second */
    this.placeName = data.results[0].formatted;
    this.timeOffset = data.results[0].annotations.timezone.offset_sec * ms;
    this.coord = data.results[0].bounds.northeast;
  }

  async getDatafromPlacename(placeName) {
    const geoData = await obtainGeoDatafromPlaceName(apiKeyGeoData, placeName, this.lang);
    this.formOutputData(geoData);
  }

  /* eslint-disable max-len */
  async getDatafromCoordinates() {
    const geoData = await obtainGeoDatafromCoord(apiKeyGeoData, this.coord.lat, this.coord.lng, this.lang);
    this.formOutputData(geoData);
  }

  async getWeatheratCoordinates() {
    const weatherData = await obtainWeather(apiKeyWeather, this.coord.lat, this.coord.lng, this.lang);
    const parsedWeatherData = await parseWeatherParametres(weatherData.list);
    this.parsedWeatherData = parsedWeatherData;
  }
  /* eslint-enable max-len */
}

const app = new App();

app.coord = {
  lat: 10.835561,
  lng: 12.963921,
};

app.getDatafromPlacename('santa monica usa')
  .then(() => app.getWeatheratCoordinates())
  .then(() => obtainLocaleTime(app.timeOffset))
  .then((res) => console.log('time: ', res.toUTCString()));
console.log(app);
