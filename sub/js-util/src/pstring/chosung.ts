const KO_CHOSUNG = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

export function chosung(str: string): string | null {
  if (str.charCodeAt(0) >= 0xac00) {
    const uniVal = str.charCodeAt(0) - 0xac00;

    const jong = uniVal % 28;
    const jung = ((uniVal - jong) / 28) % 21;
    const cho2 = ((uniVal - jong) / 28 - jung) / 21;

    return KO_CHOSUNG[cho2];
  }
  return null;
}
