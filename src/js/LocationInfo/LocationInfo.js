import obtainIPInfo from './obtainIPInfo';
import obtainWeather from './obtainWeather';
import { obtainGeoDatafromPlaceName, obtainGeoDatafromCoord } from './obtainGeoData';
import translatePlacename from './translatePlacename';
import obtainLocaleTime from './obtainLocaleTime';
import obtainLocaleSeason from './obtainLocaleSeason';
import obtainLocaleDayTime from './obtainLocaleDayTime';

const apiKeyIPInfo = 'ad4cb296462880';
const apiKeyWeather = 'df8d41cc3412c9b1ac992d87f6fa81d3';
const apiKeyGeoData = '5f01a3a9d68f415c94ad261794e7fae4';

export default class LocationInfo {
  constructor() {
    this.coord = null;
    this.timeOffset = null;
    this.placeName = null;
    this.weatherData = null;
  }

  async getUserCoordinates() {
    const userIPInfo = await obtainIPInfo(apiKeyIPInfo);
    const userLocation = await userIPInfo.loc.split(',');
    this.coord = {
      lat: userLocation[0],
      lng: userLocation[1],
    };
  }

  formLocationData(data) {
    const ms = 1000; /* milliseconds in second */
    this.placeName = data.results[0].formatted;
    this.timeOffset = data.results[0].annotations.timezone.offset_sec * ms;
    this.coord = data.results[0].bounds.northeast;
  }

  async getDatafromPlacename(placeName) {
    const geoData = await obtainGeoDatafromPlaceName(apiKeyGeoData, placeName);
    this.formLocationData(geoData);
  }

  /* eslint-disable max-len */
  async getDatafromCoordinates() {
    const geoData = await obtainGeoDatafromCoord(apiKeyGeoData, this.coord.lat, this.coord.lng);
    this.formLocationData(geoData);
  }

  async getWeatheratCoordinates() {
    const weatherData = await obtainWeather(apiKeyWeather, this.coord.lat, this.coord.lng);
    this.weatherData = weatherData;
  }
  /* eslint-enable max-len */

  async translatePlacename() {
    this.placeName = await translatePlacename(this.placeName);
  }

  getTimeData() {
    this.currentTime = obtainLocaleTime(this.timeOffset);
    this.season = obtainLocaleSeason(this.currentTime, this.coord.lat);
    this.dayTime = obtainLocaleDayTime(this.currentTime);
  }

  async initialLoad() {
    try {
      await this.getUserCoordinates();
      await this.getDatafromCoordinates();
      await this.getWeatheratCoordinates();
      this.getTimeData();
      await this.translatePlacename();
    } catch (error) {
      console.log(error.message);
    }
  }

  async findWeatherAtPlace(placeName) {
    try {
      await this.getDatafromPlacename(placeName);
      await this.getWeatheratCoordinates();
      this.getTimeData();
      await this.translatePlacename();
    } catch (error) {
      console.log(error.message);
    }
  }
}
