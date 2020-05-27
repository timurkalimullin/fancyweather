import './styles/scss.scss';

import LocationInfo from './js/LocationInfo/LocationInfo';
import translations from './js/translations/translations';

class App {
  constructor(root) {
    this.root = root;
    this.locationInfo = new LocationInfo();
    this.lang = localStorage.lang || 'be';
    this.scale = 'cel';
  }

  setLanguage(lang) {
    this.lang = lang;
    localStorage.setItem('lang', lang);
  }

  makeFormattedDate(date) {
    const nonFormatted = new Date(date);
    const dayNumber = nonFormatted.getDay();
    const dayName = translations.days[this.lang][dayNumber];
    const monthNumber = nonFormatted.getMonth();
    const monthName = translations.months[this.lang][monthNumber];
    const hours = nonFormatted.getHours();
    const minutes = nonFormatted.getMinutes();
    const seconds = nonFormatted.getSeconds();
    return `${dayName} ${nonFormatted.getDate()} ${monthName}  ${hours}:${minutes}:${seconds}`;
  }

  timer(nodeElement) {
    const dateContent = nodeElement;
    dateContent.innerHTML = this.makeFormattedDate(this.locationInfo.currentTime);
    this.locationInfo.currentTime += 1000;
  }

  renderControlBlock() {
    const controlBlock = document.createElement('div');
    controlBlock.classList.add('control-block');
    controlBlock.innerHTML = `
    <button class="btn btn__refresh">Refresh</button>
    <select name="lang-select" class="lang-select">
      <option value="en">ENG</option>
      <option value="ru">РУС</option>
      <option value="be">БЕЛ</option>
    </select>
    <button class="temp-scale">Far</button>
    <button class="temp-scale">Cel</button>

    <form class="search-form">
      <input type="text" name="search-input" class="search-form__input" placeholder="${translations.placeholder[this.lang]}">
      <button class="btn btn__submit">Search</button>
    </form>
    `;
    this.root.append(controlBlock);
  }

  renderCurrentinfoBlock() {
    const { id } = this.locationInfo.weatherData.current.weather[0];
    const { dayTime } = this.locationInfo;
    const temp = this.locationInfo.weatherData.current.temp[this.scale];
    const weatherDescr = translations.weather_descr[this.lang][id];
    const feelsLike = this.locationInfo.weatherData.current.feels_like;
    const wind = this.locationInfo.weatherData.current.wind_speed;
    const { humidity } = this.locationInfo.weatherData.current;
    const currentInfoBlock = document.createElement('div');
    currentInfoBlock.classList.add('currentinfo-block');
    currentInfoBlock.innerHTML = `
    <div class="current-info__placename">${this.locationInfo.placeName[this.lang]}</div>
    <div class="current-info__date">${this.makeFormattedDate(this.locationInfo.currentTime)}</div>
    <div class="current-info__temperature">${temp}</div>
    <div class="current-info__icon"><img src=${translations.icons[id][dayTime]} alt="weather-icon"></div>
    <div class="current-info__descr">
      <div class="weather_descr">${weatherDescr.toUpperCase()}</div>
      <div class="feelslike">${translations.feelslike[this.lang].toUpperCase()} : ${feelsLike}</div>
      <div class="humidity">${translations.humidity[this.lang].toUpperCase()} : ${humidity}</div>
      <div class="wind">${translations.wind[this.lang].toUpperCase()} : ${wind}</div>
    </div>
    `;
    this.root.append(currentInfoBlock);
    setInterval(this.timer.bind(this, document.querySelector('.current-info__date')), 1000);
  }
}

const app = new App(document.querySelector('.app'));

window.onload = async () => {
  await app.locationInfo.findWeatherAtPlace('гавайи');
  app.renderControlBlock();
  app.renderCurrentinfoBlock();
  console.log(app);
};
