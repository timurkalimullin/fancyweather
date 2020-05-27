import './styles/scss.scss';

import Swiper from 'swiper';

import LocationInfo from './js/LocationInfo/LocationInfo';
import translations from './js/translations/translations';

const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ja3liYWxib2Fmcm9tcnVzc2lhIiwiYSI6ImNrYXBkdHRnYzFlOGQycm12ZzQydWN5d3oifQ.OFqcwKaHMKmGkdmYNL27yw';
const map = new mapboxgl.Map({
  container: 'mapbox',
  style: 'mapbox://styles/mapbox/light-v10',
  zoom: 9,
});

class App {
  constructor(root) {
    this.root = root;
    this.locationInfo = new LocationInfo();
    this.lang = localStorage.lang || 'en';
    this.scale = 'cel';
  }

  setLanguage(lang) {
    this.lang = lang;
    localStorage.setItem('lang', lang);
  }

  makeFormattedDate(date) {
    const nonFormatted = new Date(date);
    const localeFormatted = nonFormatted.toLocaleString(this.lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const hours = nonFormatted.getHours() < 10 ? `0${nonFormatted.getHours()}` : nonFormatted.getHours();
    const minutes = nonFormatted.getMinutes() < 10 ? `0${nonFormatted.getMinutes()}` : nonFormatted.getMinutes();
    const seconds = nonFormatted.getSeconds() < 10 ? `0${nonFormatted.getSeconds()}` : nonFormatted.getSeconds();
    return `${localeFormatted}  ${hours}:${minutes}:${seconds}`;
  }

  timer(nodeElement) {
    const dateContent = nodeElement;
    dateContent.innerHTML = this.makeFormattedDate(this.locationInfo.currentTime);
    this.locationInfo.currentTime += 1000;
  }

  makeSlide(data) {
    const tempMax = data.temp.max[this.scale];
    const tempMin = data.temp.min[this.scale];
    const { id } = data.weather[0];
    const { dayTime } = this.locationInfo;
    const MS = 1000;
    const localeDate = new Date(data.dt * MS).toLocaleString(this.lang, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    slide.innerHTML = `
    <div class="swiper-slide__container">
      <div class="slide__title">${localeDate}</div>
      <div class="slide__info">
        <div class="slide__temperature">${tempMax}, ${tempMin}</div>
        <div class="slide__icon"><img src="${translations.icons[id][dayTime]}" alt="slide-icon"></div>
      </div>
    </div>
    `;
    return slide;
  }

  renderControlBlock() {
    const control = document.createElement('div');
    control.classList.add('control-block');
    control.innerHTML = `
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
    this.root.append(control);
  }

  renderMainBlock() {
    const { id } = this.locationInfo.weatherData.current.weather[0];
    const { dayTime } = this.locationInfo;
    const temp = this.locationInfo.weatherData.current.temp[this.scale];
    const weatherDescr = translations.weather_descr[this.lang][id];
    const feelsLike = this.locationInfo.weatherData.current.feels_like[this.scale];
    const wind = this.locationInfo.weatherData.current.wind_speed;
    const { humidity } = this.locationInfo.weatherData.current;
    const main = document.createElement('div');
    main.classList.add('main');
    main.innerHTML = `
      <div class="main__info">
        <div class="main__info__wrapper">
          <div class="main__info__title">
            <div class="main__placename">${this.locationInfo.placeName[this.lang]}</div>
            <div class="main__date">${this.makeFormattedDate(this.locationInfo.currentTime)}</div>
            <div class="main__temperature">${temp} ${translations.temp_units[this.scale]}</div>
          </div>
          <div class="main__info__descr">
            <div class="main__icon"><img src=${translations.icons[id][dayTime]} alt="weather-icon"></div>
            <div class="weather_descr">${weatherDescr.toUpperCase()}</div>
            <div class="feelslike">${translations.feelslike[this.lang].toUpperCase()} : ${feelsLike} ${translations.temp_units[this.scale]}</div>
            <div class="humidity">${translations.humidity[this.lang].toUpperCase()} : ${humidity} %</div>
            <div class="wind">${translations.wind[this.lang].toUpperCase()} : ${wind} ${translations.speed[this.lang]}</div>
          </div>
        </div>
        <div class="swiper-container">
          <div class="swiper-wrapper"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </div>
    `;
    this.root.append(main);
    setInterval(this.timer.bind(this, document.querySelector('.main__date')), 1000);
  }
}

const app = new App(document.querySelector('.app'));

window.onload = async () => {
  await app.locationInfo.findWeatherAtPlace('киев');
  app.renderControlBlock();
  app.renderMainBlock();
  console.log(app);
  map.jumpTo({
    center: [
      app.locationInfo.coord.lng,
      app.locationInfo.coord.lat,
    ],
    essential: true,
  });
  new mapboxgl.Marker()
    .setLngLat([app.locationInfo.coord.lng, app.locationInfo.coord.lat])
    .addTo(map);
  const mySwiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    loop: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    slidesPerView: 2,
    speed: 400,
    spaceBetween: 100,
  });
  Object.keys(app.locationInfo.weatherData.daily).forEach((key) => {
    const slide = app.makeSlide(app.locationInfo.weatherData.daily[key]);
    mySwiper.appendSlide(slide);
  });
};
