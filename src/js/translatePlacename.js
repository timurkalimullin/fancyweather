export default async function translatePlacename(placeName) {
  const modifiedPlacename = [];
  modifiedPlacename.push(placeName.split(',').shift());
  modifiedPlacename.push(placeName.split(',').pop());
  modifiedPlacename.join('');

  const temp = {
    ru: null,
    en: null,
    be: null,
  };
  const apiKey = 'trnsl.1.1.20200423T141800Z.a13d7b3458025d70.13846b8c77630bf3379bbfeeb09d689a22a6605d';
  /* translates placename to languages in temp */
  await Promise.all(Object.keys(temp).map((lang) => fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${apiKey}&text=${modifiedPlacename}&lang=${lang}`)
    .then((res) => res.json())
    .then((json) => {
      const text = json.text[0];
      temp[`${lang}`] = text;
    })));
  return temp;
}
