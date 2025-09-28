/**
 * 테스트 유틸리티 함수들
 */

/**
 * 함수가 에러를 던지는지 테스트하는 헬퍼
 */
export function expectToThrow(fn: () => any, expectedError?: string | RegExp) {
  expect(() => fn()).toThrow(expectedError);
}

/**
 * 비동기 함수가 에러를 던지는지 테스트하는 헬퍼
 */
export async function expectToThrowAsync(fn: () => Promise<any>, expectedError?: string | RegExp) {
  await expect(() => fn()).rejects.toThrow(expectedError);
}

/**
 * 배열의 순서를 무시하고 요소들이 같은지 확인
 */
export function expectArraysToHaveSameElements<T>(actual: T[], expected: T[]) {
  expect(actual.sort()).toEqual(expected.sort());
}

/**
 * 객체의 타입을 확인하는 헬퍼
 */
export function expectTypeOf(value: any, expectedType: string) {
  expect(typeof value).toBe(expectedType);
}

/**
 * 값이 undefined가 아님을 확인
 */
export function expectToBeDefined<T>(value: T | undefined): asserts value is T {
  expect(value).toBeDefined();
}

/**
 * 테스트 픽스처 생성 헬퍼들
 */
export const testFixtures = {
  // 문자열 테스트 데이터
  strings: {
    empty: '',
    whitespace: '   ',
    simple: 'hello',
    withSpaces: 'hello world',
    korean: '안녕하세요',
    special: 'hello-world_test.123',
    multiline: 'line1\nline2\nline3',
  },

  // 배열 테스트 데이터
  arrays: {
    empty: [],
    numbers: [1, 2, 3, 4, 5],
    strings: ['a', 'b', 'c'],
    mixed: [1, 'hello', true, null],
    nested: [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
  },

  // 객체 테스트 데이터
  objects: {
    empty: {},
    simple: { id: 1, name: 'test' },
    nested: { user: { id: 1, profile: { name: 'test' } } },
    withArrays: { items: [1, 2, 3], tags: ['a', 'b'] },
  },

  // 날짜 테스트 데이터
  dates: {
    epoch: new Date(0),
    now: new Date(),
    future: new Date('2030-01-01'),
    past: new Date('2000-01-01'),
  },
};
