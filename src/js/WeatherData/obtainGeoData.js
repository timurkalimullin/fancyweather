
async function obtainGeoDatafromCoord(apiKey, lat, lng) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${apiKey}&abbrv=0`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function obtainGeoDatafromPlaceName(apiKey, place) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${place}&key=${apiKey}&abbrv=0`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

export { obtainGeoDatafromPlaceName, obtainGeoDatafromCoord };
