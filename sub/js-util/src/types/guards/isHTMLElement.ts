import { createTypeGuard } from '../utils.js';

/**
 * Checks if the value is an HTMLElement.
 * 
 * @category Type Guard
 * @example
 *
 * ```typescript
 * const element = document.getElementById('myButton');
 * 
 * if (isHTMLElement(element)) {
 *   // TypeScript knows element is HTMLElement
 *   element.style.color = 'blue';
 *   element.addEventListener('click', handleClick);
 * }
 * ```
 */
export function isHTMLElement(input: unknown): input is HTMLElement {
  return createTypeGuard<HTMLElement>(
    (value) => 
      typeof HTMLElement !== 'undefined' && 
      value instanceof HTMLElement
  )(input);
}