export default async function obtainWeather(apiKey, lat, lng) {
  const url = `
  https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric
  `;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}
