import './styles/scss.scss';

import Swiper from 'swiper';

import LocationInfo from './js/LocationInfo/LocationInfo';
import translations from './js/translations/translations';
import obtainBackgroundImage from './js/obtainBackgroundImage';

const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ja3liYWxib2Fmcm9tcnVzc2lhIiwiYSI6ImNrYXBkdHRnYzFlOGQycm12ZzQydWN5d3oifQ.OFqcwKaHMKmGkdmYNL27yw';

class App {
  constructor(root) {
    this.root = document.querySelector(root);
    this.locationInfo = new LocationInfo();
    this.lang = localStorage.lang || 'be';
    this.scale = 'cel';
  }

  setLanguage(lang) {
    this.lang = lang;
    localStorage.setItem('lang', lang);
  }

  async setBackGroundImage() {
    const placeName = this.locationInfo.placeName.en;
    const { season } = this.locationInfo;
    const { dayTime } = this.locationInfo;
    const wallPaper = await obtainBackgroundImage(placeName, season, dayTime);
    const randomPhoto = Math.floor(Math.random() * wallPaper.length);
    this.root.style.backgroundImage = `linear-gradient(rgba(8, 15, 26, 0.7) 0%, rgba(17, 17, 46, 0.46) 100%),
    url(${wallPaper[randomPhoto].url_h})`;
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
    const tempAvg = (Number(data.temp.max[this.scale]) + Number(data.temp.min[this.scale])) / 2;
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
      <div class="slide__title">${localeDate.toUpperCase()}</div>
      <div class="slide__info">
        <div class="slide__temperature">${tempAvg.toFixed(1)}</div>
        <div class="slide__icon"><img src="${translations.icons[id][dayTime]}" alt="slide-icon"></div>
      </div>
    </div>
    `;
    return slide;
  }

  renderSwiper(container) {
    // container = query selector ( like '.container')
    this.swiper = new Swiper(container, {
      direction: 'horizontal',
      loop: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      slidesPerView: 1,
      speed: 400,
      breakpoints: {
        500: {
          slidesPerView: 3,
        },
      },
    });
    Object.keys(this.locationInfo.weatherData.daily).forEach((key) => {
      const slide = this.makeSlide(this.locationInfo.weatherData.daily[key]);
      this.swiper.appendSlide(slide);
    });
  }

  renderMap(container) {
    // container = node element id (like 'mapbox')
    this.map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      zoom: 9,
    });

    this.map.jumpTo({
      center: [
        this.locationInfo.coord.lng,
        this.locationInfo.coord.lat,
      ],
      essential: true,
    });
    new mapboxgl.Marker()
      .setLngLat([this.locationInfo.coord.lng, this.locationInfo.coord.lat])
      .addTo(this.map);
  }

  renderControlBlock() {
    const control = document.createElement('div');
    control.classList.add('control-block');
    control.innerHTML = `
    <div class="btn__wrapper">
      <button class="btn btn__refresh raise"><i class="icon-arrows-cw"></i></button>
      <select name="lang-select" class="lang-select">
        <option value="en">ENG</option>
        <option value="ru">РУС</option>
        <option value="be">БЕЛ</option>
      </select>
      <button data="far" class="btn btn__temp-scale">°F</button>
      <button data="cel" class="btn btn__temp-scale">°C</button>
    </div>
    <form class="search-form">
      <input type="text" name="search-input" class="search-form__input" placeholder="${translations.placeholder[this.lang]}">
      <button type="submit" class="btn btn__submit"><i class="icon-search"></i></button>
      <button class="btn btn__mic" type="button"><i class="icon-mic"></i></button>
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
    const latitude = translations.coords.lat[this.lang];
    const longitude = translations.coords.lng[this.lang];

    const main = document.createElement('div');
    main.classList.add('main');
    main.innerHTML = `
    <div class="main__container">
      <div class="main__info">
        <div class="main__info__wrapper">
          <div class="main__info__title">
            <div class="main__placename">${this.locationInfo.placeName[this.lang]}</div>
            <div class="main__date">${this.makeFormattedDate(this.locationInfo.currentTime)}</div>
            <div class="main__temperature"><img src="./images/thermometer.svg">${temp} ${translations.temp_units[this.scale]}</div>
            <div class="feelslike">${translations.feelslike[this.lang].toUpperCase()} : ${feelsLike} ${translations.temp_units[this.scale]}</div>
            <div class="humidity">${translations.humidity[this.lang].toUpperCase()} : ${humidity} %</div>
            <div class="wind">${translations.wind[this.lang].toUpperCase()} : ${wind} ${translations.speed[this.lang]}</div>
          </div>
          <div class="main__info__graphic">
            <div class="main__icon"><img src=${translations.icons[id][dayTime]} alt="weather-icon"></div>
            <div class="weather_descr">${weatherDescr.toUpperCase()}</div>
          </div>
        </div>
        <div class="swiper-container">
          <div class="swiper-wrapper"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </div>
      <div class="main__map">
        <div id="mapbox" class="mapbox"></div>
        <p class="lat">${this.locationInfo.dms.lat}  ${latitude}</p>
        <p class="lat">${this.locationInfo.dms.lng}  ${longitude}</p>
      </div>
    </div>
    `;
    this.root.append(main);
    setInterval(this.timer.bind(this, document.querySelector('.main__date')), 1000);
    this.renderSwiper('.swiper-container');
    this.renderMap('mapbox');
  }

  clearMain() {
    document.querySelector('.main').remove();
    return this;
  }
}

const app = new App('.app');

window.onload = async () => {
  try {
    app.renderControlBlock();
    await app.locationInfo.findWeatherAtPlace('эдинбург');
    await app.setBackGroundImage();
    app.renderMainBlock();
    document.querySelector('.control-block').addEventListener('click', (e) => {
      if (e.target.closest('.btn__temp-scale')) {
        const scale = e.target.getAttribute('data');
        app.scale = scale;
        app.clearMain();
        app.renderMainBlock();
      }
    });
    console.log(app);
  } catch (err) {
    console.log(err.message);
  }
};
