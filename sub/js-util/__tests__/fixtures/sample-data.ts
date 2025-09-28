/**
 * 테스트용 샘플 데이터
 */

export const sampleUsers = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 }
] as const

export const sampleStrings = {
  // 케이스 변환 테스트용
  camelCase: 'helloWorld',
  pascalCase: 'HelloWorld',
  kebabCase: 'hello-world',
  snakeCase: 'hello_world',
  constantCase: 'HELLO_WORLD',
  
  // 트림 테스트용
  withSpaces: '  hello world  ',
  multiSpaces: 'hello    world',
  tabsAndNewlines: '\t\nhello\nworld\t\n',
  
  // 특수 문자
  withSpecialChars: 'hello@world#123',
  htmlString: '<div>Hello &amp; World</div>',
  urlString: 'https://example.com/path?param=value',
  
  // 한글
  korean: '안녕하세요',
  koreanWithSpaces: '  안녕하세요  ',
  mixed: 'Hello 안녕 World'
} as const

export const sampleNumbers = {
  integers: [0, 1, -1, 42, -42, 100, 1000],
  floats: [0.0, 1.5, -1.5, 3.14159, -3.14159],
  edge: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Infinity, -Infinity, NaN],
  strings: ['0', '1', '1.5', '100', 'abc', '', '  123  ']
} as const

export const sampleDates = {
  timestamps: [
    0, // Unix epoch
    1640995200, // 2022-01-01 00:00:00 UTC
    1672531200, // 2023-01-01 00:00:00 UTC
    4102444800  // 2100-01-01 00:00:00 UTC
  ],
  strings: [
    '2023-01-01',
    '2023-01-01T00:00:00Z',
    '2023-01-01T09:00:00+09:00',
    'Jan 1, 2023',
    'invalid-date'
  ],
  objects: [
    new Date('2023-01-01'),
    new Date('2023-12-31'),
    new Date(0),
    new Date('invalid')
  ]
} as const

export const sampleArrays = {
  empty: [],
  singleItem: [1],
  numbers: [1, 2, 3, 4, 5],
  strings: ['a', 'b', 'c', 'd'],
  mixed: [1, 'hello', true, null, undefined],
  nested: [[1, 2], [3, 4], [5, 6]],
  duplicates: [1, 2, 2, 3, 3, 3],
  objects: sampleUsers,
  withNulls: [1, null, 2, undefined, 3],
  large: Array.from({ length: 1000 }, (_, i) => i)
} as const