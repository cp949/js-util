export function isUnicodeBlank(str: string | undefined | null): boolean {
  if (!str) return true;

  // 정규표현식 `\p{Zs}`는 유니코드 공백 문자를 포함하고, `\s`는 일반 공백, 탭, 개행을 포함합니다.
  return /^\p{Zs}*\s*$/u.test(str);
}

export function isNotUnicodeBlank(str: string | undefined | null): boolean {
  return !isUnicodeBlank(str);
}

/**
 // 테스트 예시
isUnicodeBlank("")           // true (빈 문자열)
isUnicodeBlank(" ")          // true (일반 공백)
isUnicodeBlank("\t\n")       // true (탭과 개행)
isUnicodeBlank("\u00A0")     // true (불간격 스페이스)
isUnicodeBlank("\u200B")     // true (제로 너비 스페이스)
isUnicodeBlank("Hello")      // false (문자열 포함)
isUnicodeBlank("  \u2009  ") // true (얇은 스페이스 포함)
 */
