export default async function obtainBackgroundImage(...args) {
  const apiKey = '617422aadcb36efa9e8bdef8a4240cbd';
  const shuffle = (array) => {
    const result = array.sort(() => Math.random() - 0.5);
    return result;
  };
  const query = shuffle([...args]).slice(0, 2);
  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${query}&tag_mode=all&extras=url_h&format=json&nojsoncallback=1`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}
