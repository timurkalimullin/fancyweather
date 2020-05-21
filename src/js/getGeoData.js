
async function getGeoData_fromCoord(apiKey, lat, lng, lang) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${apiKey}&language=${lang}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function getGeoData_fromPlaceName(apiKey, place, lang) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${place}&key=${apiKey}&language=${lang}&abbrv=0`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}


export {getGeoData_fromPlaceName, getGeoData_fromCoord};
