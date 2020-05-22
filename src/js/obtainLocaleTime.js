export default function obtainLocaleTime(localeOffset) {
  const userTime = new Date();
  const utcTime = Date.UTC(userTime.getUTCFullYear(), userTime.getUTCMonth(),
    userTime.getUTCDate(), userTime.getUTCHours(),
    userTime.getUTCMinutes(), userTime.getUTCSeconds());
  const localeTime = utcTime + localeOffset;
  return new Date(localeTime);
}
