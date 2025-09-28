// copy from https://github.com/WebDevSimplified/js-util-functions/blob/main/domUtils/script.js

/**
 * querySelectorAll() 편의 함수
 *
 * @param selector - 요소 선택자
 * @param parent - parent 요소
 * @returns Element의 배열
 *
 * @example
 * console.log("Buttons:\n", qsa(".btn"))
 * console.log("Wrapper:\n", qs(".wrapper"))
 * console.log("Buttons In Wrapper:\n", qsa(".btn", qs(".wrapper")))
 */
export function qsa<T extends Element>(
  selector: string,
  parent: Document | HTMLElement = document,
): T[] {
  return Array.from(parent.querySelectorAll<T>(selector));
}
