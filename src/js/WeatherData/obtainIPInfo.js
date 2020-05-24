export default async function obtainIPInfo(apiKey) {
  const url = `https://ipinfo.io/json?token=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

// city: "Saarbrücken"
// country: "DE"
// hostname: "136.ip-54-37-73.eu"
// ip: "54.37.73.136"
// loc: "49.2333,7.0000"
// org: "AS16276 OVH SAS"
// postal: "66123"
// region: "Saarland"
// timezone: "Europe/Berlin"
