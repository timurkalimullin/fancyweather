import './styles/scss.scss';

import WeatherData from './js/WeatherData/WeatherData';
import translatePlacename from './js/translatePlacename';
import translations from './js/translations/translations';

class App {
  constructor() {
    this.weatherData = new WeatherData();
    this.lang = localStorage.lang || 'en';
    this.translatedPlacename = null;
  }

  async translatePlacename() {
    this.translatedPlacename = await translatePlacename(this.weatherData.placeName);
  }
}

const app = new App();
app.weatherData.findWeatherAtPlace('chicago')
.then(()=>{
  document.body.innerHTML = `
<div></div>
<img src="${translations.icons[app.weatherData.parsedWeatherData['4/26/2020'].weather_id].night}">
</div>
`;
})
console.log(app);


