export default async function obtainIPInfo(apiKey) {
  const url = `https://ipinfo.io/json?token=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('IPinfoAPI network problems, can`t find you');
  }
  const data = await res.json();
  return data;
}
