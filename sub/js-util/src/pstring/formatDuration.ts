const padZero = (num: number): string => {
  return num >= 10 ? num.toString() : '0' + num;
};

const pad = (num: number, leading: boolean): string => {
  if (!leading) return num.toString();
  return padZero(num);
};

/**
 * 밀리초를 duration 포맷팅 한다
 * @param ms 포매팅 할 시간(밀리초)
 * @param withZeroHour true이면 시간부분이 0이라도 시간을 포함
 * @param leadingZero 앞부분에 0을 붙인다
 * @returns
 */
export function formatDurationByMilli(
  ms: number,
  withZeroHour = false,
  leadingZero = true,
): string {
  const seconds = Math.abs(Math.ceil(ms / 1000)),
    h = (seconds - (seconds % 3600)) / 3600,
    m = ((seconds - (seconds % 60)) / 60) % 60,
    s = seconds % 60;

  if (h > 0 || withZeroHour) {
    return (ms < 0 ? '-' : '') + pad(h, leadingZero) + ':' + padZero(m) + ':' + padZero(s);
  } else {
    return (ms < 0 ? '-' : '') + pad(m, leadingZero) + ':' + padZero(s);
  }
}

/**
 * 밀리초를 duration 포맷팅 한다
 * @param sec 포매팅 할 시간(초)
 * @param withZeroHour true이면 시간부분이 0이라도 시간을 포함
 * @param leadingZero 앞부분에 0을 붙인다
 * @returns
 */
export function formatDurationBySec(sec: number, withZeroHour = true, leadingZero = true): string {
  return formatDurationByMilli(sec * 1000, withZeroHour, leadingZero);
}
