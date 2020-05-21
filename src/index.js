import './styles/scss.scss';

import getIPInfo from './js/getIPInfo';
import getWeather from './js/getWeather';
import {getGeoData_fromPlaceName, getGeoData_fromCoord} from './js/getGeoData';


const apiKeyIPInfo = 'ad4cb296462880';
const apiKeyWeather = 'df8d41cc3412c9b1ac992d87f6fa81d3';
const apiKeyGeoData = '5f01a3a9d68f415c94ad261794e7fae4';

class App {
  constructor() {
    this.coord = null;
    this.lang = 'ru';
    this.timeZone = null;
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
    this.placeName = data.results[0].formatted;
    this.timeZone = data.results[0].annotations.timezone.offset_sec;
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
}

const app = new App();

app.coord = {
  lat: 41.234,
  lng: 32.554
}
app.getData_fromCoordinates()
console.log(app);

let date = new Date().toUTCString()
console.log(date)

