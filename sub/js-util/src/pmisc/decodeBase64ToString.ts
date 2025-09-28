/**
 * atob()와 btoa()의 이름이 햇갈려서 아래의 두 함수를 만들었다.
 *
 * 두 함수의 이름에 포함된 'b'는 'binary'나 'base64'를 의미하지 않는다.
 * 그리고 atob()와 btoa()는 binary를 지원하지 않는다.
 *
 * 두 함수의 이름에 포함된 'b'는 개념적으로 원시 데이터(string)를 의미한다.
 * 그리고 두 함수의 이름에 포함된 'a'는 base64 문자열을 의미한다.
 * 그래서 atob는 base64를 원시 데이터(string)로 변환
 * btoa는 원시 데이터(string)를 base64로 변환하는 함수이다.
 *
 * 기억하기 어려워서, 좀 더 직관적인 함수를 만들었다.
 */

/**
 * base64로 디코딩
 * atob() 함수와 동일, atob의 이름이 기억하기 어려워 이름을 변경한 것 뿐임
 *
 * 참고)
 * atob를 'ascii to binary'나 'ascii to base64'로 착각하기 쉽다.
 * 그래서 더 직관적인 이름의 함수를 만들었다.
 *
 * @param b64encoded base64 문자열(단, 원시 데이터도 문자열 타입이어야 한다)
 * @returns 디코딩 된 문자열, 원시 데이터
 */
export const decodeBase64ToString = (b64encoded: string): string => atob(b64encoded);
