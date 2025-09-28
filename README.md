# CP949 JS-Util Monorepo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Turborepo](https://img.shields.io/badge/Built%20with-Turborepo-blueviolet)](https://turbo.build/)

**CP949 JS-Util Monorepo**는 JavaScript/TypeScript 유틸리티 라이브러리 `@cp949/js-util`과 관련 도구들을 포함하는 통합 개발 환경입니다.

## 🏗️ 모노레포 구조

### 📱 Applications

- **`apps/exam`** (`@cp949/exam-app`) - Next.js 기반 테스트 애플리케이션
  - 포트: 3000
  - 유틸리티 라이브러리 사용 예제 및 데모

### 📦 Packages

- **`sub/js-util`** (`@cp949/js-util`) - **메인 유틸리티 라이브러리**
  - npm에 배포되는 핵심 패키지
  - 배열, 문자열, 날짜, DOM 등 다양한 유틸리티 제공
  - TypeScript 완벽 지원

- **`sub/eslint-config`** (`@repo/eslint-config`) - ESLint 설정
  - 프로젝트 전체에서 사용하는 공통 린트 규칙
  - Next.js, React 등 환경별 설정 제공

- **`sub/typescript-config`** (`@repo/typescript-config`) - TypeScript 설정
  - 프로젝트 전체에서 사용하는 공통 TypeScript 설정
  - Next.js, React 라이브러리 등 환경별 설정 제공

## 🚀 시작하기

### 필수 조건

- **Node.js**: >= 18
- **Package Manager**: pnpm (권장)

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd js-util

# 의존성 설치
pnpm install
```

## 🛠️ 개발 명령어

### 전체 모노레포 작업

```bash
# 모든 앱/패키지 개발 서버 시작
pnpm dev

# 모든 패키지 빌드
pnpm build

# 전체 린트 검사
pnpm lint

# 전체 타입 체크
pnpm typecheck

# 코드 포맷팅
pnpm format
```

### 특정 패키지 작업

```bash
# 특정 앱만 개발 서버 시작
turbo dev --filter=@cp949/exam-app

# 특정 패키지만 빌드
turbo build --filter=@cp949/js-util

# 특정 패키지만 린트
turbo lint --filter=@cp949/js-util
```

### js-util 라이브러리 개발

```bash
cd sub/js-util

# 라이브러리 빌드 (watch 모드)
npm run dev

# 테스트 실행
npm run test

# 테스트 (watch 모드)
npm run test:watch

# 테스트 커버리지
npm run test:coverage

# 테스트 UI
npm run test:ui

# 타입 체크
npm run typecheck
```

## 🧪 테스트

### 전체 테스트

```bash
# js-util 패키지 테스트
pnpm --filter @cp949/js-util test

# 커버리지 포함 테스트
pnpm --filter @cp949/js-util test:coverage
```

### 개별 테스트

```bash
# 특정 테스트 파일 실행
cd sub/js-util
npx vitest run __tests__/array.test.ts

# 특정 테스트 케이스만
npx vitest run __tests__/array.test.ts -t "append"
```

## 📦 배포

### NPM 배포 (수동)

```bash
cd sub/js-util

# 1. 코드 품질 검증
npm run lint
npm run typecheck
npm run test:coverage

# 2. 빌드
npm run build

# 3. 버전 업데이트
npm version patch  # 또는 minor, major

# 4. NPM 배포
npm publish --access public
```

### GitHub Actions 자동 배포

1. `release` 브랜치에 코드 푸시
2. GitHub Actions가 자동으로 테스트, 빌드, 배포 실행
3. NPM에 자동 배포 완료

#### 필요한 GitHub Secrets

- `NPM_TOKEN`: NPM 계정의 Access Token

## 🔧 개발 도구

### 코드 품질

- **ESLint**: 코드 린팅 및 스타일 가이드
- **Prettier**: 코드 포맷팅 (printWidth: 100, 2 spaces)
- **TypeScript**: 정적 타입 검사

### 빌드 도구

- **Turborepo**: 모노레포 빌드 시스템
- **Tsup**: TypeScript 라이브러리 번들러
- **Vitest**: 테스트 프레임워크 (Jest 호환)

### 환경 설정

- **EditorConfig**: 에디터 설정 통일
- **pnpm Workspace**: 패키지 의존성 관리
- **GitHub Actions**: CI/CD 파이프라인

## 🏗️ 아키텍처

### 빌드 시스템

```
┌─────────────────┐
│   Turborepo     │
├─────────────────┤
│ ┌─────────────┐ │
│ │ @cp949/     │ │  ← 메인 라이브러리 (npm 배포)
│ │ js-util     │ │
│ └─────────────┘ │
│ ┌─────────────┐ │
│ │ @cp949/     │ │  ← 데모 앱
│ │ exam-app    │ │
│ └─────────────┘ │
│ ┌─────────────┐ │
│ │ @repo/      │ │  ← 개발 도구 (내부용)
│ │ configs     │ │
│ └─────────────┘ │
└─────────────────┘
```

### 패키지 의존성

```
@cp949/exam-app
├── @cp949/js-util
├── @repo/eslint-config
└── @repo/typescript-config

@cp949/js-util
├── @repo/eslint-config
└── @repo/typescript-config
```

## 🤝 기여 가이드

### 코드 기여

1. **Fork & Clone**
   ```bash
   git clone <your-fork-url>
   cd js-util
   ```

2. **환경 설정**
   ```bash
   pnpm install
   pnpm dev  # 개발 서버 시작으로 환경 확인
   ```

3. **기능 개발**
   ```bash
   git checkout -b feature/amazing-feature
   # 코드 작성
   pnpm test    # 테스트 실행
   pnpm lint    # 린트 검사
   pnpm build   # 빌드 확인
   ```

4. **커밋 & PR**
   ```bash
   git commit -m "feat: add amazing feature"
   git push origin feature/amazing-feature
   # GitHub에서 Pull Request 생성
   ```

### 코딩 스타일

- **언어**: TypeScript 사용
- **포맷팅**: Prettier 설정 준수 (100자, 2 spaces)
- **네이밍**: camelCase (함수, 변수), PascalCase (타입, 클래스)
- **주석**: JSDoc 형식으로 함수 문서화
- **테스트**: 새로운 기능에 대한 테스트 작성 필수

### 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 추가 또는 수정
chore: 빌드 프로세스 또는 보조 도구 변경
```

## 📚 문서

- **API 문서**: `sub/js-util/README.md`
- **개발 가이드**: `CLAUDE.md`
- **변경 로그**: `CHANGELOG.md` (예정)

## 🔗 유용한 링크

### Turborepo 문서

- [Tasks](https://turbo.build/repo/docs/crafting-your-repository/running-tasks)
- [Caching](https://turbo.build/repo/docs/crafting-your-repository/caching)
- [Filtering](https://turbo.build/repo/docs/crafting-your-repository/running-tasks#using-filters)

### 개발 도구

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Guide](https://vitest.dev/guide/)
- [ESLint Configuration](https://eslint.org/docs/user-guide/configuring/)

## 📄 라이센스

[MIT License](LICENSE)

---

**유지보수**: [CP949](https://github.com/cp949)
**이슈 리포트**: [GitHub Issues](https://github.com/cp949/js-util/issues)
**토론**: [GitHub Discussions](https://github.com/cp949/js-util/discussions)