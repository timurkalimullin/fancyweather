import './styles/scss.scss';

import WeatherData from './js/WeatherData/WeatherData';

const weatherData = new WeatherData();

window.onload = () => {
  weatherData.initialLoad()
    .then(() => document.body.append(JSON.stringify(weatherData)));
  console.log(weatherData);
};
