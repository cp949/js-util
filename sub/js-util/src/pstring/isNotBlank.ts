import { isBlank } from './isBlank.js';

export function isNotBlank(str: string | undefined | null): str is string {
  return !isBlank(str);
}
