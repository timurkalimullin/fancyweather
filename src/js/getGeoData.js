async function getGeoData_reverse(apiKey, lat, lng, lang) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${apiKey}&language=${lang}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log('geo data: ',data);
  return data;
}

async function getGeoData_forward(apiKey, place, lang) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${place}&key=${apiKey}&language=${lang}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log('geo data: ',data);
  return data;
}

export {getGeoData_forward, getGeoData_reverse};
