export default function conversetempScale(data) {
  const celsiusToFarenheit = (num) => (9 / 5) * num + 32;

  return {
    cel: data.toFixed(1),
    far: celsiusToFarenheit(data).toFixed(1),
  };
}
