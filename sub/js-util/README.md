# @cp949/js-util

[![npm version](https://badge.fury.io/js/@cp949%2Fjs-util.svg)](https://badge.fury.io/js/@cp949%2Fjs-util)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**@cp949/js-util**은 일상적인 JavaScript/TypeScript 개발에 필요한 다양한 유틸리티 함수들을 제공하는 포괄적인 라이브러리입니다.

## 🚀 특징

- **📦 모듈식 설계**: 필요한 기능만 선택적으로 import 가능
- **🔒 타입 안전**: 완전한 TypeScript 지원 및 타입 정의 제공
- **🔄 불변성 지원**: 원본 수정(`append`) 및 불변(`$append`) 함수 모두 제공
- **🌲 트리셰이킹**: 사용하지 않는 코드 자동 제거로 번들 크기 최적화
- **📚 풍부한 문서**: JSDoc과 한글 주석으로 상세한 설명 제공
- **✅ 높은 테스트 커버리지**: 80% 이상의 테스트 커버리지

## 📦 설치

```bash
npm install @cp949/js-util
```

```bash
yarn add @cp949/js-util
```

```bash
pnpm add @cp949/js-util
```

## 🎯 사용법

### 전체 라이브러리 import

```typescript
import * from '@cp949/js-util';
```

### 개별 모듈 import (권장)

```typescript
// 배열 유틸리티
import { append, chunks, shuffle } from '@cp949/js-util/array';

// 문자열 유틸리티
import { camelCase, isBlank, truncate } from '@cp949/js-util/string';

// Base64 인코딩/디코딩
import { encode, decode } from '@cp949/js-util/base64';

// 날짜 처리 (dayjs 필요)
import { formatDate, addDays } from '@cp949/js-util/date';
```

## 📁 모듈 구조

| 모듈           | 설명                                       | 주요 함수                                                  |
| -------------- | ------------------------------------------ | ---------------------------------------------------------- |
| `array`        | 배열 조작 및 처리 (mutable/immutable 지원) | `append`/`$append`, `chunks`, `shuffle`, `groupBy`, `uniq` |
| `string`       | 문자열 변환 및 검증                        | `camelCase`, `isBlank`, `truncate`, `slugify`              |
| `base64`       | Base64 인코딩/디코딩                       | `encode`, `decode`, `arrayBufferToBase64`                  |
| `browser`      | 브라우저 환경 유틸리티                     | 브라우저 감지, 기능 확인                                   |
| `date`         | 날짜 처리 (dayjs 의존성)                   | 날짜 포맷팅, 계산, 검증                                    |
| `dom`          | DOM 조작                                   | DOM 요소 선택, 조작, 이벤트 처리                           |
| `file`         | 파일 처리                                  | 파일 읽기, 변환, 검증                                      |
| `http`         | HTTP 요청 유틸리티                         | 요청 도우미, URL 처리                                      |
| `math`         | 수학 계산                                  | 수치 계산, 변환, 검증                                      |
| `random`       | 랜덤 생성                                  | 랜덤 값, 문자열, 선택                                      |
| `type`         | 타입 검사                                  | 타입 가드, 검증 함수                                       |
| `web`          | 웹 개발 유틸리티                           | 웹 관련 도우미 함수                                        |
| `misc`         | 기타 유틸리티                              | 분류되지 않은 유용한 함수들                                |
| `eventemitter` | 이벤트 에미터                              | 사용자 정의 이벤트 시스템                                  |
| `uint8-array`  | Uint8Array 처리                            | 바이너리 데이터 조작                                       |
| `dataurl`      | Data URL 처리                              | Data URL 인코딩/디코딩                                     |
| `fn`           | 함수형 프로그래밍                          | 고차 함수, 커링, 컴포지션                                  |
| `easing`       | 애니메이션 이징                            | 애니메이션 이징 함수들                                     |
| `usermedia`    | 미디어 스트림                              | 카메라, 마이크 접근                                        |

## 🔧 사용 예시

### 배열 처리

```typescript
import { append, $append, chunks, shuffle, groupBy } from '@cp949/js-util/array';

// 배열에 요소 추가 (Mutable - 원본 수정)
const arr = [1, 2, 3];
append(arr, [3, 4, 5], true); // [1, 2, 3, 4, 5] (중복 제거)
console.log(arr); // [1, 2, 3, 4, 5] - 원본이 변경됨

// 배열에 요소 추가 (Immutable - 새 배열 생성)
const original = [1, 2, 3];
const newArr = $append(original, [4, 5]);
console.log(original); // [1, 2, 3] - 원본 유지
console.log(newArr); // [1, 2, 3, 4, 5] - 새 배열

// 배열을 청크로 분할
chunks([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// 배열 섞기
shuffle([1, 2, 3, 4, 5]); // [3, 1, 5, 2, 4] (랜덤)

// 그룹핑
const users = [
  { name: '김철수', age: 20 },
  { name: '이영희', age: 20 },
  { name: '박민수', age: 25 },
];
groupBy(users, (user) => user.age);
// { 20: [{name: '김철수', age: 20}, {name: '이영희', age: 20}], 25: [{name: '박민수', age: 25}] }
```

### 문자열 처리

```typescript
import { camelCase, isBlank, truncate, slugify } from '@cp949/js-util/string';

// 카멜케이스 변환
camelCase('hello', 'world', 'example'); // 'helloWorldExample'

// 공백 문자열 체크
isBlank('  '); // true
isBlank('hello'); // false

// 문자열 자르기
truncate('매우 긴 문자열입니다', 10); // '매우 긴 문자열...'

// URL 슬러그 생성
slugify('Hello World! 한글 테스트'); // 'hello-world-한글-테스트'
```

### Base64 인코딩/디코딩

```typescript
import { encode, decode } from '@cp949/js-util/base64';

// 문자열을 Base64로 인코딩
const encoded = encode('Hello, 안녕하세요!'); // 'SGVsbG8sIOyViOuFleuYleywuOyalCE='

// Base64를 문자열로 디코딩
const decoded = decode(encoded); // 'Hello, 안녕하세요!'
```

### 📝 Mutable vs Immutable 패턴

`@cp949/js-util`의 배열 유틸리티는 **Mutable(변경)**과 **Immutable(불변)** 두 가지 패턴을 모두 제공합니다:

#### 🔄 Mutable 함수 (원본 수정)

- **함수명**: `append`, `prepend`, `insertAt`, `removeAt`, `remove`, `move` 등
- **동작**: 원본 배열을 직접 수정하고 같은 배열을 반환
- **사용 시점**: 성능이 중요하거나 메모리 사용을 최소화하고 싶을 때

#### ✨ Immutable 함수 (새 배열 생성)

- **함수명**: `$append`, `$prepend`, `$insertAt`, `$removeAt`, `$remove`, `$move` 등
- **동작**: 원본 배열을 유지하고 새로운 배열을 생성하여 반환
- **사용 시점**: 함수형 프로그래밍, React state 관리, 원본 데이터 보존이 필요할 때

```typescript
import {
  append,
  $append,
  prepend,
  $prepend,
  insertAt,
  $insertAt,
  removeAt,
  $removeAt,
} from '@cp949/js-util/array';

const original = [1, 2, 3];

// ========== Mutable 패턴 (원본 수정) ==========
const mutated = [...original]; // 원본 보호를 위한 복사

append(mutated, [4, 5]); // [1, 2, 3, 4, 5] - 원본 수정
prepend(mutated, [0]); // [0, 1, 2, 3, 4, 5] - 원본 수정
insertAt(mutated, 3, [2.5]); // [0, 1, 2, 2.5, 3, 4, 5] - 원본 수정
removeAt(mutated, 0); // [1, 2, 2.5, 3, 4, 5] - 원본 수정

console.log(mutated); // [1, 2, 2.5, 3, 4, 5]

// ========== Immutable 패턴 (새 배열 생성) ==========
let result = original; // [1, 2, 3]

result = $append(result, [4, 5]); // [1, 2, 3, 4, 5] - 새 배열
result = $prepend(result, [0]); // [0, 1, 2, 3, 4, 5] - 새 배열
result = $insertAt(result, 3, [2.5]); // [0, 1, 2, 2.5, 3, 4, 5] - 새 배열
result = $removeAt(result, 0); // [1, 2, 2.5, 3, 4, 5] - 새 배열

console.log(original); // [1, 2, 3] - 원본 유지
console.log(result); // [1, 2, 2.5, 3, 4, 5]
```

#### 🔧 중복 제거 옵션

많은 배열 함수에서 `uniq` 옵션을 제공하여 중복 제거 규칙을 설정할 수 있습니다:

```typescript
import { append, $append } from '@cp949/js-util/array';

const users = [
  { id: 1, name: '김철수' },
  { id: 2, name: '이영희' },
];

// 중복 허용 (기본값)
$append(users, [
  { id: 2, name: '이영희' },
  { id: 3, name: '박민수' },
]);
// [{ id: 1, name: '김철수' }, { id: 2, name: '이영희' }, { id: 2, name: '이영희' }, { id: 3, name: '박민수' }]

// 값 자체로 중복 판단
$append(
  users,
  [
    { id: 2, name: '이영희' },
    { id: 3, name: '박민수' },
  ],
  true,
);
// [{ id: 1, name: '김철수' }, { id: 2, name: '이영희' }, { id: 2, name: '이영희' }, { id: 3, name: '박민수' }]
// 객체는 참조가 다르므로 중복으로 판단되지 않음

// 함수로 중복 판단 (id 기준)
$append(
  users,
  [
    { id: 2, name: '이영희' },
    { id: 3, name: '박민수' },
  ],
  (user) => user.id,
);
// [{ id: 1, name: '김철수' }, { id: 2, name: '이영희' }, { id: 3, name: '박민수' }]
// id가 같으면 중복으로 판단하여 제거
```

## 📋 의존성

### Peer Dependencies

- **dayjs** (선택적): `@cp949/js-util/date` 모듈 사용시 필요

```bash
npm install dayjs  # date 모듈 사용시에만 설치
```

## 🛠️ TypeScript 설정

이 라이브러리는 TypeScript로 작성되었으며, 별도의 `@types` 패키지 설치 없이 바로 사용할 수 있습니다.

```typescript
// tsconfig.json에서 모듈 해상도 설정
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

## 🌟 고급 사용법

### 타입 가드 활용

```typescript
import { isString, isNumber, isDefined } from '@cp949/js-util/type';

function processValue(value: unknown) {
  if (isString(value)) {
    // value는 이제 string 타입으로 추론됨
    return value.toUpperCase();
  }

  if (isNumber(value)) {
    // value는 이제 number 타입으로 추론됨
    return value * 2;
  }

  return null;
}
```

### 체이닝 패턴

```typescript
import { chunks, shuffle } from '@cp949/js-util/array';
import { capitalize } from '@cp949/js-util/string';

const words = ['apple', 'banana', 'cherry', 'date', 'elderberry'];

const result = chunks(shuffle(words), 2)
  .map((chunk) => chunk.map(capitalize))
  .flat();
```

## 📄 라이센스

[MIT License](LICENSE)

## 🤝 기여하기

기여를 환영합니다! 다음 단계를 따라주세요:

1. 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

### 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/cp949/js-util.git
cd js-util

# 의존성 설치
pnpm install

# 개발 모드 실행
pnpm dev

# 테스트 실행
pnpm test

# 빌드
pnpm build
```

## 📞 지원

- [GitHub Issues](https://github.com/cp949/js-util/issues) - 버그 리포트 및 기능 요청
- [GitHub Discussions](https://github.com/cp949/js-util/discussions) - 질문 및 토론

---

Made with ❤️ by [CP949](https://github.com/cp949)
