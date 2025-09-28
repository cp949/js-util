/**
 * 주어진 배열을 chunk 단위로 쪼갠다
 *
 * @param arr 대상 배열
 * @param chunkSize chunk 크기
 * @returns chunk 배열(2차원)
 */
export function chunks<T>(arr: ReadonlyArray<T>, chunkSize: number): T[][] {
  const chunked_arr: T[][] = [];
  let i = 0;
  while (i < arr.length) {
    chunked_arr.push(arr.slice(i, chunkSize + i));
    i += chunkSize;
  }

  return chunked_arr;
}
