/**
 * 배열을 무작위로 섞습니다.(Fisher–Yates (Knuth) Shuffle 알고리즘)
 * 주어진 배열을 변경합니다.
 *
 * @param array - 대상 배열
 * @returns 배열
 */
export function shuffle<T>(arr: T[]): T[] {
  return shuffle_(arr);
}

/**
 * 배열을 무작위로 섞습니다.(Fisher–Yates (Knuth) Shuffle 알고리즘)
 *
 * @param array - 대상 배열
 * @returns 복제된 배열
 */
export function $shuffle<T>(arr: ReadonlyArray<T>): T[] {
  return shuffle_([...arr]);
}

function shuffle_<T>(array: T[]): T[] {
  // if it's 1 or 0 items, just return
  if (array.length <= 1) return array;

  // For each index in array
  for (let i = 0; i < array.length; i++) {
    const j = Math.floor(Math.random() * (i + 1)); // 0부터 i까지 무작위 인덱스 선택

    // place our random choice in the spot by swapping
    [array[i], array[j]] = [array[j], array[i]]; // 두 요소를 스왑
  }

  return array;
}
