/**
 * range 함수
 * @param start
 * @param end
 * @param step
 * @example
for (const value of range(0, 10))
    console.log(value); // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9

for (const value of range(5, 15, 2))
    console.log(value); // 5, 7, 9, 11, 13

for (const value of range(10, 0, -2))
    console.log(value); // 10, 8, 6, 4, 2
*/
export function* range(start: number, end: number, step: number = 1): Generator<number> {
  if (step === 0) {
    throw new Error('step cannot be 0');
  }

  if (start < end) {
    for (let i = start; i < end; i += step) {
      yield i;
    }
  } else {
    for (let i = start; i > end; i += step) {
      yield i;
    }
  }
}
