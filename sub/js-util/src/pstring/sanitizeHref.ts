import { encodeUrl } from './encodeUrl.js';

/**
 * 사용자가 입력한 값을 링크(`href`)로 포맷팅합니다.
 *
 * 이 함수는 다음 작업을 수행합니다:
 *  - 앞뒤 공백 제거
 *  - 입력값이 프로토콜을 포함하지 않는 경우 기본 프로토콜을 추가
 *    (단, 상대 경로(`/`)나 앵커(`#`)로 시작하는 경우는 제외)
 *  - 결과 값을 URL-인코딩 처리
 *
 * @param value - 사용자가 입력한 값
 * @param defaultProtocol - 기본적으로 추가할 프로토콜 (예: `http://`). 기본값은 `"http://"`입니다.
 * @returns 포맷팅된 링크 값
 *
 * @example
 * // 기본 프로토콜 사용
 * sanitizeHref("example.com");
 * // 결과: "http://example.com"
 *
 * @example
 * // 사용자 정의 프로토콜 사용
 * sanitizeHref("example.com", "https://");
 * // 결과: "https://example.com"
 *
 * @example
 * // 상대 경로를 입력한 경우
 * sanitizeHref("/about");
 * // 결과: "/about"
 *
 * @example
 * // 메일 주소를 입력한 경우
 * sanitizeHref("mailto:test@example.com");
 * // 결과: "mailto:test@example.com"
 */
export function sanitizeHref(value: string, defaultProtocol = 'http://'): string {
  // 입력값이 상대 경로(`/`) 또는 앵커(`#`)가 아닌 경우,
  // 프로토콜이 없으면 기본 프로토콜(defaultProtocol)을 추가합니다.
  let currentHrefValue = value.trim(); // 입력값의 앞뒤 공백 제거
  if (currentHrefValue && !/^(https?:\/\/|mailto:|tel:|sms:|\/|#)/.test(currentHrefValue)) {
    currentHrefValue = `${defaultProtocol}${currentHrefValue}`; // 사용자 정의 또는 기본 프로토콜 추가
  }

  // URL로 사용할 수 없는 문자를 URL-인코딩 처리합니다.
  // `encodeurl`을 사용하여 이미 인코딩된 부분은 다시 인코딩하지 않도록 방지.
  // (예: 사용자가 이미 인코딩된 URL을 입력한 경우에도 문제 없도록 처리)
  return encodeUrl(currentHrefValue);
}
