import './styles/scss.scss';

import WeatherData from './js/WeatherData/WeatherData';
import translatePlacename from './js/translatePlacename';

class App {
  constructor() {
    this.weatherData = new WeatherData();
    this.lang = localStorage.lang || 'en';
    this.translatedPlacename = null;
  }

  async translatePlacename() {
    await this.weatherData.findWeatherAtPlace('могадишо');
    this.translatedPlacename = await translatePlacename(this.weatherData.placeName);
    console.log(this);
  }
}

const app = new App();

async function qqq() {
  await app.translatePlacename();
  document.body.append(JSON.stringify(app.translatedPlacename.be));
}
qqq();
