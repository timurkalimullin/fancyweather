import './styles/scss.scss';

import getIPInfo from './js/getIPInfo';
import getWeather from './js/getWeather';
import {getGeoData_fromPlaceName, getGeoData_fromCoord} from './js/getGeoData';
import getlocaleTime from './js/getlocaleTime';
import getLocaleTime from './js/getlocaleTime';


const apiKeyIPInfo = 'ad4cb296462880';
const apiKeyWeather = 'df8d41cc3412c9b1ac992d87f6fa81d3';
const apiKeyGeoData = '5f01a3a9d68f415c94ad261794e7fae4';

class App {
  constructor() {
    this.coord = null;
    this.lang = 'ru';
    this.timeOffset = null;
    this.placeName = null;
  }

  async getUserCoordinates() {
    const userIPInfo = await getIPInfo(apiKeyIPInfo);
    const userLocation = await userIPInfo.loc.split(',');
    this.coord = {
      lat: userLocation[0],
      lng: userLocation[1]
    };
  }

  formOutputData(data) {
    const ms = 1000; /* milliseconds in second */
    this.placeName = data.results[0].formatted;
    this.timeOffset = data.results[0].annotations.timezone.offset_sec*ms;
    this.coord = data.results[0].bounds.northeast;
  }

  async getData_fromPlacename(placeName) {
    const geoData = await getGeoData_fromPlaceName(apiKeyGeoData, placeName, this.lang);
    this.formOutputData(geoData);
  }

  async getData_fromCoordinates() {
    const geoData = await getGeoData_fromCoord(apiKeyGeoData, this.coord.lat, this.coord.lng, this.lang);
    this.formOutputData(geoData);
  }

  async getWeather_atCoordinates() {
    const weatherData = await getWeather(apiKeyWeather, this.coord.lat, this.coord.lng);
    return weatherData;
  }
}

const app = new App();

app.coord = {
  lat: 41.234,
  lng: 32.554
}
// app.getUserCoordinates().then(()=>app.getData_fromCoordinates()).then(()=>app.getWeather_atCoordinates())

console.log(app);
// app.getData_fromPlacename('miami usa').then(()=>app.getWeather_atCoordinates())
// setInterval(getlocaleTime.bind(null, 18000000), 1000)

function timer() {
  document.body.innerHTML = getlocaleTime(app.timeOffset).toUTCString();
}
setInterval(timer, 1000)
