export default function obtainLocaleTime(localeOffset) {
  const SEC = 60;
  const MS = 1000;
  const userOffset = new Date().getTimezoneOffset() * SEC * MS;
  const localeTime = new Date().getTime() + userOffset + localeOffset;
  return new Date(localeTime);
}
