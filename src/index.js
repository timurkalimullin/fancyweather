import './styles/scss.scss';

import LocationInfo from './js/LocationInfo/LocationInfo';
import translations from './js/translations/translations';

class App {
  constructor(root) {
    this.root = root;
    this.locationInfo = new LocationInfo();
    this.lang = localStorage.lang || 'be';
  }

  setLanguage(lang) {
    this.lang = lang;
    localStorage.setItem('lang', lang);
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
    const currentInfoBlock = document.createElement('div');
    currentInfoBlock.classList.add('currentinfo-block');
    currentInfoBlock.innerHTML = `
    <div class="current-info__placename">${this.locationInfo.placeName[this.lang]}</div>
    <div class="current-info__date"></div>
    <div class="current-info__temperature"></div>
    <div class="current-info__icon"></div>
    `;
    this.root.append(currentInfoBlock);
  }
}

const app = new App(document.querySelector('.app'));

window.onload = async () => {
  await app.locationInfo.findWeatherAtPlace('london');
  app.renderControlBlock();
  app.renderCurrentinfoBlock();
  console.log(app);
};
