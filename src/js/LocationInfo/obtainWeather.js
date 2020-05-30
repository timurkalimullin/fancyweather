export default async function obtainWeather(apiKey, lat, lng) {
  const url = `
  https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=hourly,minutely&appid=${apiKey}&units=metric
  `;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('OpenweatherAPI network problems');
  }
  const data = await res.json();
  return data;
}
