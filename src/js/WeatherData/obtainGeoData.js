
async function obtainGeoDatafromCoord(apiKey, lat, lng, lang) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${apiKey}&language=${lang}&abbrv=0`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function obtainGeoDatafromPlaceName(apiKey, place, lang) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${place}&key=${apiKey}&language=${lang}&abbrv=0`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

export { obtainGeoDatafromPlaceName, obtainGeoDatafromCoord };
