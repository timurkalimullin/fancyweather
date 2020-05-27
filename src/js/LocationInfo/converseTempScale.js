export default function conversetempScale(data) {
  const celsiusToFarenheit = (num) => (9 / 5) * num + 32;
  /* eslint-disable no-param-reassign */
  data.current.temp = {
    cel: data.current.temp.toFixed(1),
    far: celsiusToFarenheit(data.current.temp).toFixed(1),
  };

  data.daily.forEach((day) => {
    Object.keys(day.temp).forEach((key) => {
      day.temp[key] = {
        cel: day.temp[key].toFixed(1),
        far: celsiusToFarenheit(day.temp[key]).toFixed(1),
      };
    });
  });
  /* eslint-enable no-param-reassign */
}
