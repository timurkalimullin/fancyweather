export default function getLocaleTime(localeOffset) {
  const userTime = new Date();
  const utcTime = Date.UTC(userTime.getUTCFullYear(), userTime.getUTCMonth(),
  userTime.getUTCDate(), userTime.getUTCHours(),
  userTime.getUTCMinutes(), userTime.getUTCSeconds())
  const localeTime = utcTime + localeOffset;
  return new Date(localeTime);
  // const sec = 60, ms =1000;
  // const userOffset = new Date().getTimezoneOffset()*sec*ms;
  // console.log('user offset: ', userOffset)
  // const localeTime = Date.now()  - (userOffset*(-1) - localeOffset);
  // return new Date(localeTime).toUTCString();
}
