import './styles/scss.scss';

import getIPInfo from './js/getLocationByIP';
import getWeather from './js/getWeather';
import {getGeoData_forward, getGeoData_reverse} from './js/getGeoData';


const apiKeyIPInfo = 'ad4cb296462880';
const apiKeyWeather = 'df8d41cc3412c9b1ac992d87f6fa81d3';
const apiKeyGeoData = '5f01a3a9d68f415c94ad261794e7fae4';

class App{
  constructor() {

  }

  async getCurrentCoordinates() {
    const currentIPInfo = await getIPInfo(apiKeyIPInfo);
    let currentLocation = await currentIPInfo.loc.split(',');
    return currentLocation;
  }
}

const app = new App();

app.getCurrentCoordinates().then(res=>console.log(res))



