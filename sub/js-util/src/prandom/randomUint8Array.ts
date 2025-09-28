/**
 * 주어진 길이만큼의 난수를 포함한 `Uint8Array`를 생성하는 함수
 *
 * `crypto.getRandomValues`를 지원하는 경우 해당 API를 사용하여 보안성이 높은 난수를 생성하며,
 * 지원하지 않는 경우 보안성이 낮은 `Math.random()`을 사용하여 난수를 생성한다.
 *
 * @param length 생성할 난수 배열의 길이
 * @returns 주어진 길이만큼의 `Uint8Array`를 반환
 *
 * @example
 * ```ts
 * const randomBytes = randomUint8Array(16);
 * console.log(randomBytes); // Uint8Array(16) [...]
 * ```
 */
export function randomUint8Array(length: number): Uint8Array {
  if (length <= 0) {
    // throw new Error("length는 1 이상이어야 합니다.");
    return new Uint8Array();
  }

  const randomBytes = new Uint8Array(length);

  if (typeof globalThis.crypto !== 'undefined' && 'getRandomValues' in globalThis.crypto) {
    globalThis.crypto.getRandomValues(randomBytes);
  } else {
    // console.warn(
    //   "crypto.getRandomValues를 사용할 수 없습니다. 보안성이 낮은 난수를 생성합니다."
    // );
    for (let i = 0; i < length; i++) {
      randomBytes[i] = Math.floor(Math.random() * 0x100); // 0~255 범위의 난수 생성
    }
  }

  return randomBytes;
}
