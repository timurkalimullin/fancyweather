
async function obtainGeoDatafromCoord(apiKey, lat, lng) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${apiKey}&abbrv=0`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 400) {
      throw new Error('Invalid request(too short or wrong format)');
    }
    throw new Error('Opencagedata Network problems or too short request');
  }
  const data = await res.json();
  return data;
}

async function obtainGeoDatafromPlaceName(apiKey, place) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${place}&key=${apiKey}&abbrv=0`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 400) {
      throw new Error('Invalid request(too short or wrong format)');
    }
    throw new Error('Opencagedata Network problems');
  }
  const data = await res.json();
  if (data.results.length === 0) {
    throw new Error('Sorry, can`t find this location');
  }
  return data;
}

export { obtainGeoDatafromPlaceName, obtainGeoDatafromCoord };
