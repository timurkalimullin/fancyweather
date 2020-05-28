
async function obtainGeoDatafromCoord(apiKey, lat, lng) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${apiKey}&abbrv=0`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status.code !== 200) {
    throw new Error(data.status.message);
  }
  return data;
}

async function obtainGeoDatafromPlaceName(apiKey, place) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${place}&key=${apiKey}&abbrv=0`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status.code !== 200) {
    throw new Error(data.status.message);
  }
  if (data.results.length === 0) {
    throw new Error('Sorry, can`t find this location');
  }
  return data;
}

export { obtainGeoDatafromPlaceName, obtainGeoDatafromCoord };
