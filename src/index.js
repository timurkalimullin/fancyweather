import './styles/scss.scss';

import Swiper from 'swiper';

import LocationInfo from './js/LocationInfo/LocationInfo';
import translations from './js/translations/translations';
import obtainBackgroundImage from './js/obtainBackgroundImage';
import obtainLocaleTime from './js/LocationInfo/obtainLocaleTime';
import missedBack from './assets/missedBack.jpg';

const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ja3liYWxib2Fmcm9tcnVzc2lhIiwiYSI6ImNrYXBkdHRnYzFlOGQycm12ZzQydWN5d3oifQ.OFqcwKaHMKmGkdmYNL27yw';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

class App {
  constructor(root) {
    this.root = document.querySelector(root);
    this.locationInfo = new LocationInfo();
    this.lang = localStorage.lang || 'en';
    this.scale = localStorage.scale || 'cel';
    this.recognition = null;
    this.recognitionIsStarted = false;
    this.isModal = false;
    this.intervalTimer = null;
  }

  async setBackGroundImage() {
    const placeName = this.locationInfo.placeName.en;
    const { season } = this.locationInfo;
    const { dayTime } = this.locationInfo;
    let wallPaper = await obtainBackgroundImage(placeName, season, dayTime);
    if (wallPaper.length === 0 || !wallPaper) {
      wallPaper = missedBack;
      console.log('No background image found for this request, using default background');
      this.root.style.backgroundImage = `linear-gradient(rgba(8, 15, 26, 0.7) 0%, rgba(17, 17, 46, 0.46) 100%),
      url(${missedBack})`;
      return;
    }
    const randomPhoto = Math.floor(Math.random() * wallPaper.length);
    const loadedImg = new Image();
    loadedImg.src = wallPaper[randomPhoto].url_h;
    loadedImg.onload = () => {
      this.root.style.backgroundImage = `linear-gradient(rgba(8, 15, 26, 0.7) 0%, rgba(17, 17, 46, 0.46) 100%),
      url(${wallPaper[randomPhoto].url_h})`;
    };
  }

  makeFormattedDate(date) {
    const nonFormatted = new Date(date);
    const localeFormatted = `
    ${translations.days[this.lang][nonFormatted.getDay()]}
    ${nonFormatted.getDate()}
    ${translations.months[this.lang][nonFormatted.getMonth()]}
    `;
    const hours = nonFormatted.getHours() < 10 ? `0${nonFormatted.getHours()}` : nonFormatted.getHours();
    const minutes = nonFormatted.getMinutes() < 10 ? `0${nonFormatted.getMinutes()}` : nonFormatted.getMinutes();
    const seconds = nonFormatted.getSeconds() < 10 ? `0${nonFormatted.getSeconds()}` : nonFormatted.getSeconds();
    return `${localeFormatted}  ${hours}:${minutes}:${seconds}`;
  }

  timer(nodeSelector) {
    const momentDate = obtainLocaleTime(this.locationInfo.timeOffset);
    this.locationInfo.currentTime = momentDate;
    this.root.querySelector(nodeSelector).innerHTML = this.makeFormattedDate(momentDate);
  }

  speechRecognitionStart() {
    this.recognition = new SpeechRecognition();
    this.recognition.interimResults = true;
    this.recognition.lang = this.lang;

    this.recognition.addEventListener('result', (e) => {
      let saying = [...e.results].map((res) => res[0]).map((result) => result.transcript)
        .join('');
      if (e.results[0].isFinal) {
        this.root.querySelector('.btn__mic').classList.remove('selected');
        this.recognitionIsStarted = false;
        saying = saying.toLowerCase();
        if (saying === 'forecast' || saying === 'прогноз' || saying === 'прагноз') {
          this.readForecast();
        } else {
          this.root.querySelector('.search-form__input').value = saying;
          this.handleRequest(saying);
        }
      }
    });

    this.recognition.start();
    this.root.querySelector('.btn__mic').classList.add('selected');
    this.recognitionIsStarted = true;
  }

  speechRecognitionStop() {
    this.recognition.stop();
    this.root.querySelector('.btn__mic').classList.remove('selected');
    this.recognitionIsStarted = false;
  }

  readForecast() {
    const { id } = this.locationInfo.weatherData.current.weather[0];
    const msg = new SpeechSynthesisUtterance();
    msg.lang = this.lang;
    msg.text = `${translations.synth.announce[this.lang]} ${this.locationInfo.placeName[this.lang]},
    ${this.makeFormattedDate(obtainLocaleTime(this.locationInfo.timeOffset))},
    ${this.locationInfo.weatherData.current.temp[this.scale]} ${translations.synth.scale[this.lang][this.scale]}
    ${translations.weather_descr[this.lang][id]}
    `;
    speechSynthesis.speak(msg);
  }

  makeSlide(data) {
    const tempAvg = (Number(data.temp.max[this.scale]) + Number(data.temp.min[this.scale])) / 2;
    const { id } = data.weather[0];
    const { dayTime } = this.locationInfo;
    const MS = 1000;
    const localeDate = new Date(data.dt * MS);
    const localeDateFormatted = `
    ${translations.days[this.lang][localeDate.getDay()]}
    ${localeDate.getDate()}
    ${translations.months[this.lang][localeDate.getMonth()]}
    `;

    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    slide.innerHTML = `
    <div class="swiper-slide__container">
      <div class="slide__title">${localeDateFormatted.toUpperCase()}</div>
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
    this.marker = new mapboxgl.Marker()
      .setLngLat([this.locationInfo.coord.lng, this.locationInfo.coord.lat])
      .addTo(this.map);
  }

  renderMainLayout() {
    const main = document.createElement('div');
    main.classList.add('main');
    main.innerHTML = `
    <div class="control-block">
      <div class="btn__wrapper"></div>
      <form class="search-form">
      </form>
    </div>
    <div class="main__container">
      <div class="main__info">
      </div>
      <div class="main__map">
      </div>
    </div>
    `;
    this.root.append(main);
  }

  renderBtnBlock(nodeSelector) {
    const nodeElement = this.root.querySelector(nodeSelector);

    nodeElement.innerHTML = `
      <button class="btn btn__refresh raise"><i class="icon-arrows-cw"></i></button>
      <select name="lang-select" class="lang-select">
        <option value="en">ENG</option>
        <option value="ru">РУС</option>
        <option value="be">БЕЛ</option>
      </select>
      <button data="far" class="btn btn__temp-scale">°F</button>
      <button data="cel" class="btn btn__temp-scale">°C</button>
    `;
    return this;
  }

  renderSearchBlock(nodeSelector) {
    const nodeElement = this.root.querySelector(nodeSelector);

    nodeElement.innerHTML = `
    <input type="text" name="search-input" class="search-form__input" placeholder="${translations.placeholder[this.lang]}">
    <button type="submit" class="btn btn__submit"><i class="icon-search"></i></button>
    <button class="btn btn__mic" type="button"><i class="icon-mic"></i><span class="tooltiptext">
    ${translations.tip[this.lang]}</span></button>
    <button class="btn btn__sound" type="button"><i class="icon-sound"></i></button>
    `;
  }

  renderMainInfo(nodeSelector) {
    const { id } = this.locationInfo.weatherData.current.weather[0];
    const { dayTime } = this.locationInfo;
    const temp = this.locationInfo.weatherData.current.temp[this.scale];
    const weatherDescr = translations.weather_descr[this.lang][id];
    const feelsLike = this.locationInfo.weatherData.current.feels_like[this.scale];
    const wind = this.locationInfo.weatherData.current.wind_speed;
    const { humidity } = this.locationInfo.weatherData.current;
    const nodeElement = this.root.querySelector(nodeSelector);

    nodeElement.innerHTML = `
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
    `;
    this.root.querySelector('.lang-select').value = this.lang;
    this.root.querySelector(`[data=${this.scale}]`).classList.add('selected');
    if (this.recognitionIsStarted) {
      this.root.querySelector('.btn__mic').classList.add('selected');
    }
    clearInterval(this.intervalTimer);
    this.intervalTimer = setInterval(this.timer.bind(this, ('.main__date')), 1000);
    this.renderSwiper('.swiper-container');
  }

  renderMainMap(nodeSelector) {
    const nodeElement = this.root.querySelector(nodeSelector);

    nodeElement.innerHTML = `
      <div id="mapbox" class="mapbox"></div>
      <div class="map-coordinates">
      </div>
    `;
    this.renderMap('mapbox');
  }

  renderMapCoordinates(nodeSelector) {
    const latitude = translations.coords.lat[this.lang];
    const longitude = translations.coords.lng[this.lang];
    const nodeElement = this.root.querySelector(nodeSelector);

    nodeElement.innerHTML = `
      <p class="lat">${this.locationInfo.dms.lat}  ${latitude}</p>
      <p class="lat">${this.locationInfo.dms.lng}  ${longitude}</p>
    `;
  }

  createPreloader(nodeSelector) {
    const nodeElement = this.root.querySelector(nodeSelector);
    this.preloader = document.createElement('div');
    this.preloader.classList.add('loader-container');
    this.preloader.innerHTML = ' <p class="loadingText">Loading</p>';
    nodeElement.append(this.preloader);
  }

  createModal(message) {
    if (!this.isModal) {
      this.isModal = true;
      const modal = document.createElement('div');
      modal.classList.add('modal');
      modal.innerHTML = `
        <div class="modal-message">${message}<br><br>Click anywhere to continue</div>
      `;
      this.root.append(modal);
      modal.addEventListener('click', () => {
        this.isModal = false;
        modal.remove();
      });
    }
  }

  changeLanguage(lang) {
    this.lang = lang;
    localStorage.setItem('lang', lang);
    this.renderSearchBlock('.search-form');
    this.renderMainInfo('.main__info');
    this.renderMapCoordinates('.map-coordinates');
  }

  changeScale(scale) {
    this.scale = scale;
    localStorage.setItem('scale', scale);
    this.scale = scale;
    this.renderMainInfo('.main__info');
  }

  clickListener() {
    this.root.querySelector('.control-block').addEventListener('click', (e) => {
      if (e.target.closest('.btn__temp-scale')) {
        this.root.querySelectorAll('.btn__temp-scale').forEach((el) => {
          el.classList.remove('selected');
        });
        e.target.classList.add('selected');
        const scale = e.target.getAttribute('data');
        this.changeScale(scale);
      }
      if (e.target.closest('.btn__refresh')) {
        this.setBackGroundImage();
      }
      if (e.target.closest('.btn__mic')) {
        if (!this.recognitionIsStarted) {
          this.speechRecognitionStart();
        } else {
          this.speechRecognitionStop();
        }
      }
      if (e.target.closest('.btn__sound')) {
        this.readForecast();
      }
    });
  }

  onChangeListener() {
    this.root.querySelector('.lang-select').addEventListener('change', (e) => {
      this.changeLanguage(e.target.value);
    });
  }

  submitlistener() {
    this.root.querySelector('.search-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const searchInput = this.root.querySelector('.search-form__input');
      this.handleRequest(searchInput.value);
    });
  }

  composeListeners() {
    this.clickListener();
    this.onChangeListener();
    this.submitlistener();
  }

  async start() {
    try {
      this.renderMainLayout();
      this.renderBtnBlock('.btn__wrapper');
      this.renderSearchBlock('.search-form');
      this.createPreloader('.main');
      await this.locationInfo.initialLoad();
      await this.setBackGroundImage();
      this.preloader.remove();
      this.renderMainInfo('.main__info');
      this.renderMainMap('.main__map');
      this.renderMapCoordinates('.map-coordinates');
      this.composeListeners();
    } catch (error) {
      this.preloader.remove();
      this.createModal(error.message);
    }
  }

  async handleRequest(request) {
    try {
      this.createPreloader('.main');
      await this.locationInfo.findWeatherAtPlace(request);
      await this.setBackGroundImage();
      this.preloader.remove();
      this.renderMainInfo('.main__info');
      this.map.flyTo({
        center: [
          this.locationInfo.coord.lng,
          this.locationInfo.coord.lat,
        ],
        speed: 4,
        essential: true,
      });
      this.marker.remove();
      this.marker = new mapboxgl.Marker()
        .setLngLat([this.locationInfo.coord.lng, this.locationInfo.coord.lat])
        .addTo(this.map);
      this.renderMapCoordinates('.map-coordinates');
    } catch (error) {
      this.preloader.remove();
      this.createModal(error.message);
    }
  }
}

const app = new App('.app');

window.onload = async () => {
  await app.start();
};
