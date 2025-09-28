/**
 * atob()와 btoa()의 이름이 햇갈려서 아래의 두 함수를 만들었다.
 *
 * 두 함수의 이름에 포함된 'b'는 'binary'나 'base64'를 의미하지 않는다.
 * 그리고 atob()와 btoa()는 binary를 지원하지도 않는다.
 *
 * 두 함수의 이름에 포함된 'b'는 개념적으로 원시 데이터(string)를 의미한다.
 * 그리고 두 함수의 이름에 포함된 'a'는 base64 문자열을 의미한다.
 * 그래서 atob는 base64를 원시 데이터(string)로 변환
 * btoa는 원시 데이터(string)를 base64로 변환하는 함수이다.
 *
 * 기억하기 어려워서, 좀 더 직관적인 함수를 만들었다.
 */

/**
 * base64로 인코딩
 * btoa() 함수와 유사하지만 유니코드 문자도 처리 가능
 *
 * 참고)
 * btoa를 'binary to ascii'나 'base64 to ascii'로 착각하기 쉽다.
 * 그래서 더 직관적인 이름의 함수를 만들었다.
 * btoa()는 ASCII 문자만 처리 가능하므로 유니코드 지원을 위해 encodeURIComponent를 사용
 *
 * @param sourceString 인코딩 할 문자열, 원시 데이터
 * @returns base64로 인코딩 된 문자열
 */
export const encodeStringToBase64 = (sourceString: string): string => {
  try {
    // 유니코드 문자를 포함한 문자열도 처리할 수 있도록 encodeURIComponent 사용
    return window.btoa(
      encodeURIComponent(sourceString).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      }),
    );
  } catch (e) {
    // Fallback: 직접 btoa 호출 (ASCII 전용)
    return window.btoa(sourceString);
  }
};
