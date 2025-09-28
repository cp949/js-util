import { sineInOut } from '../easing/sine.js';

/**
 * t가 0에서 0.5사이인 경우 [0~1]을 리턴하고
 * t가 0.5에서 1사이인 경우 [1-0]을 리턴한다.
 * Given a value between 0 to 1, returns a value that cycles between 0 -> 1 -> 0 using the provided shaping method.
 * @param t a value between 0 to 1
 * @param method a shaping method. Default to [`sineInOut`](#link).
 * @return a value between 0 to 1
 */
export const cycle = (t: number, method: (t: number) => number = sineInOut): number => {
  return method(t > 0.5 ? 2 - t * 2 : t * 2);
};
