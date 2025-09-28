// copy from https://github.com/WebDevSimplified/js-util-functions/blob/main/domUtils/script.js

/**
 * querySelector() 편의 함수
 *
 * @param selector - 요소 선택자
 * @param parent - parent 요소
 * @returns Element
 *
 * @example
 * console.log("Wrapper:\n", qs(".wrapper"))
 */
export function qs<T extends Element>(
  selector: string,
  parent: Document | HTMLElement = document,
): T | null {
  return parent.querySelector<T>(selector);
}
