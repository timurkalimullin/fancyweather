
export default function parseWeatherParametres(data) {
  const temp = {
  };
  /*  makes arrays of temperature and weather for each day */
  data.forEach((el) => {
    Object.keys(el).forEach((key) => {
      if (key === 'dt_txt') {
        const dateKey = `${new Date(el[key]).getUTCMonth()}/${new Date(el[key]).getUTCDate()}/${new Date(el[key]).getUTCFullYear()}`;
        if (!temp[dateKey]) {
          temp[dateKey] = {
            day: new Date(el[key]).getUTCDay(),
            temperature: [],
            weather_id: [],
            weather_descr: [],
          };
        }
        temp[dateKey].temperature.push(el.main.temp);
        temp[dateKey].weather_id.push(el.weather[0].id);
        temp[dateKey].weather_descr.push(el.weather[0].description);
      }
    });
  });
  /* gets max and min temperature, weather at the middle of day for each day */
  Object.values(temp).forEach((el) => {
    const maxTemperature = Math.max.apply(null, el.temperature);
    const minTemperature = Math.min.apply(null, el.temperature);
    const element = el;
    element.temperature = [maxTemperature, minTemperature];
    element.weather_id = el.weather_id[Math.ceil(el.weather_id.length / 2)];
    element.weather_descr = el.weather_descr[Math.ceil(el.weather_descr.length / 2)];
  });
  /* gets current weather parametres  */
  temp.now = {
    temperature: data[0].main.temp,
    feelslike: data[0].main.feels_like,
    humidity: data[0].main.humidity,
    weather_id: data[0].weather[0].id,
    weather: data[0].weather[0].main,
    weather_descr: data[0].weather[0].description,
    wind: data[0].wind,
  };
  return temp;
}
