import { describe, test, expect } from 'vitest';
import {
  isValidDataURL,
  extractMimeType,
  getDataURLSize,
  isImageDataURL,
  isSvgDataURL,
  isBase64DataURL,
  stripDataURLPrefix,
  convertDataURLToBlob
} from '../../../src/dataurl/index.js';

// 테스트용 샘플 dataURL들
const SAMPLE_DATA_URLS = {
  // 1x1 투명 PNG
  png: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77yQAAAABJRU5ErkJggg==',
  // 간단한 JPEG
  jpeg: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
  // SVG
  svg: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJlZCIvPjwvc3ZnPg==',
  // 텍스트
  text: 'data:text/plain;base64,SGVsbG8gV29ybGQ=',
  // JSON
  json: 'data:application/json;base64,eyJuYW1lIjoiSm9obiBEb2UifQ==',
  // Base64가 아닌 plain text
  plainText: 'data:text/plain,Hello%20World'
};

describe('dataurl - Data URL Functions', () => {
  describe('isValidDataURL', () => {
    test('유효한 dataURL들', () => {
      Object.values(SAMPLE_DATA_URLS).forEach(dataURL => {
        expect(isValidDataURL(dataURL)).toBe(true);
      });
    });
    
    test('유효하지 않은 dataURL들', () => {
      const invalidURLs = [
        '',
        'not-a-data-url',
        'data:',
        'data:image/png',
        'data:image/png;base64',
        'http://example.com/image.png',
        'data:;base64,', // 빈 MIME 타입
      ];
      
      invalidURLs.forEach(url => {
        expect(isValidDataURL(url), `"${url}" should be invalid`).toBe(false);
      });
    });
    
    test('경계 케이스', () => {
      expect(isValidDataURL('data:image/png;base64,')).toBe(true); // 빈 base64 데이터
      expect(isValidDataURL('data:text/plain,simple text')).toBe(true); // plain text
    });
  });

  describe('extractMimeType', () => {
    test('MIME 타입 정확한 추출', () => {
      expect(extractMimeType(SAMPLE_DATA_URLS.png)).toBe('image/png');
      expect(extractMimeType(SAMPLE_DATA_URLS.jpeg)).toBe('image/jpeg');
      expect(extractMimeType(SAMPLE_DATA_URLS.svg)).toBe('image/svg+xml');
      expect(extractMimeType(SAMPLE_DATA_URLS.text)).toBe('text/plain');
      expect(extractMimeType(SAMPLE_DATA_URLS.json)).toBe('application/json');
      expect(extractMimeType(SAMPLE_DATA_URLS.plainText)).toBe('text/plain');
    });
    
    test('유효하지 않은 케이스들', () => {
      const invalidCases = [
        '',
        'not-a-data-url',
        'data:',
        'data:image/png', // 세미콜론 없음
        'data:;base64,abc', // 빈 MIME 타입
        'data:,abc', // MIME 타입 없음
      ];
      
      invalidCases.forEach(url => {
        expect(extractMimeType(url), `"${url}" should return undefined`).toBeUndefined();
      });
    });
    
    test('복잡한 MIME 타입', () => {
      expect(extractMimeType('data:text/html;charset=utf-8,<h1>Hello</h1>')).toBe('text/html');
      expect(extractMimeType('data:application/vnd.ms-excel;base64,abc')).toBe('application/vnd.ms-excel');
    });
  });

  describe('isImageDataURL', () => {
    test('이미지 dataURL 감지', () => {
      expect(isImageDataURL(SAMPLE_DATA_URLS.png)).toBe(true);
      expect(isImageDataURL(SAMPLE_DATA_URLS.jpeg)).toBe(true);
      expect(isImageDataURL(SAMPLE_DATA_URLS.svg, true)).toBe(true); // SVG 포함
    });
    
    test('SVG 옵션 테스트', () => {
      expect(isImageDataURL(SAMPLE_DATA_URLS.svg, false)).toBe(false); // SVG 제외
      expect(isImageDataURL(SAMPLE_DATA_URLS.svg, true)).toBe(true); // SVG 포함
    });
    
    test('비이미지 dataURL', () => {
      expect(isImageDataURL(SAMPLE_DATA_URLS.text)).toBe(false);
      expect(isImageDataURL(SAMPLE_DATA_URLS.json)).toBe(false);
      expect(isImageDataURL(SAMPLE_DATA_URLS.plainText)).toBe(false);
    });
    
    test('다양한 이미지 형식', () => {
      const imageFormats = [
        'data:image/png;base64,abc',
        'data:image/jpeg;base64,abc',
        'data:image/gif;base64,abc',
        'data:image/bmp;base64,abc',
        'data:image/webp;base64,abc'
      ];
      
      imageFormats.forEach(dataUrl => {
        expect(isImageDataURL(dataUrl)).toBe(true);
      });
    });
  });

  describe('isSvgDataURL', () => {
    test('SVG dataURL 감지', () => {
      expect(isSvgDataURL(SAMPLE_DATA_URLS.svg)).toBe(true);
    });
    
    test('비SVG dataURL', () => {
      expect(isSvgDataURL(SAMPLE_DATA_URLS.png)).toBe(false);
      expect(isSvgDataURL(SAMPLE_DATA_URLS.jpeg)).toBe(false);
      expect(isSvgDataURL(SAMPLE_DATA_URLS.text)).toBe(false);
    });
    
    test('SVG 변형들', () => {
      const svgVariants = [
        'data:image/svg+xml;base64,abc',
        'data:image/svg+xml;charset=utf-8,<svg></svg>'
      ];
      
      svgVariants.forEach(dataUrl => {
        expect(isSvgDataURL(dataUrl)).toBe(true);
      });
    });
  });

  describe('isBase64DataURL', () => {
    test('base64 dataURL 감지', () => {
      expect(isBase64DataURL(SAMPLE_DATA_URLS.png)).toBe(true);
      expect(isBase64DataURL(SAMPLE_DATA_URLS.jpeg)).toBe(true);
      expect(isBase64DataURL(SAMPLE_DATA_URLS.svg)).toBe(true);
      expect(isBase64DataURL(SAMPLE_DATA_URLS.text)).toBe(true);
      expect(isBase64DataURL(SAMPLE_DATA_URLS.json)).toBe(true);
    });
    
    test('plain text dataURL', () => {
      expect(isBase64DataURL(SAMPLE_DATA_URLS.plainText)).toBe(false);
    });
    
    test('다양한 형식', () => {
      expect(isBase64DataURL('data:text/plain;charset=utf-8;base64,SGVsbG8=')).toBe(true);
      expect(isBase64DataURL('data:text/plain;charset=utf-8,Hello')).toBe(false);
    });
  });

  describe('getDataURLSize', () => {
    test('크기 계산 정확성', () => {
      // "Hello World" = 11 바이트
      // Base64 인코딩: SGVsbG8gV29ybGQ= (16 문자, 패딩 1개)
      const helloWorldDataURL = SAMPLE_DATA_URLS.text;
      const calculatedSize = getDataURLSize(helloWorldDataURL);
      
      // Base64 디코딩: (16 * 3/4) - 1 = 12 - 1 = 11
      expect(calculatedSize).toBe(11);
    });
    
    test('패딩 처리', () => {
      // 패딩이 없는 경우
      const noPadding = 'data:text/plain;base64,SGVsbG8'; // "Hello" = 5바이트, 8문자
      expect(getDataURLSize(noPadding)).toBe(6); // 8 * 3/4 = 6
      
      // 패딩이 1개인 경우  
      const onePadding = 'data:text/plain;base64,SGVsbG8='; // "Hello" = 5바이트, 8문자 + =
      expect(getDataURLSize(onePadding)).toBe(5); // 8 * 3/4 - 1 = 5
      
      // 패딩이 2개인 경우
      const twoPadding = 'data:text/plain;base64,SGVsbA=='; // "Hell" = 4바이트, 8문자 + ==
      expect(getDataURLSize(twoPadding)).toBe(4); // 8 * 3/4 - 2 = 4
    });
    
    test('빈 데이터', () => {
      const emptyData = 'data:text/plain;base64,';
      expect(getDataURLSize(emptyData)).toBe(0);
    });
    
    test('실제 이미지 크기', () => {
      // 1x1 PNG의 실제 크기 확인
      const pngSize = getDataURLSize(SAMPLE_DATA_URLS.png);
      expect(pngSize).toBeGreaterThan(0);
      expect(pngSize).toBeLessThan(200); // 1x1 PNG는 매우 작아야 함
    });
  });

  describe('stripDataURLPrefix', () => {
    test('프리픽스 제거', () => {
      const base64Data = stripDataURLPrefix(SAMPLE_DATA_URLS.text);
      expect(base64Data).toBe('SGVsbG8gV29ybGQ=');
      
      const pngData = stripDataURLPrefix(SAMPLE_DATA_URLS.png);
      expect(pngData).toBe('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77yQAAAABJRU5ErkJggg==');
    });
    
    test('plain text 데이터', () => {
      const plainData = stripDataURLPrefix(SAMPLE_DATA_URLS.plainText);
      expect(plainData).toBe('Hello%20World');
    });
    
    test('잘못된 형식', () => {
      expect(stripDataURLPrefix('not-a-data-url')).toBeUndefined();
      expect(stripDataURLPrefix('')).toBeUndefined();
    });
  });

  describe('convertDataURLToBlob', () => {
    test('PNG 변환', () => {
      const blob = convertDataURLToBlob(SAMPLE_DATA_URLS.png);
      
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('image/png');
      expect(blob.size).toBeGreaterThan(0);
    });
    
    test('텍스트 변환', () => {
      const blob = convertDataURLToBlob(SAMPLE_DATA_URLS.text);
      
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('text/plain');
      expect(blob.size).toBe(11); // "Hello World"의 바이트 크기
    });
    
    test('JSON 변환', () => {
      const blob = convertDataURLToBlob(SAMPLE_DATA_URLS.json);
      
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/json');
    });
    
    test('Blob 내용 검증', async () => {
      const blob = convertDataURLToBlob(SAMPLE_DATA_URLS.text);
      
      // jsdom 환경에서 blob.text()가 지원되지 않으므로 기본 속성만 검증
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('text/plain');
    });
    
    test('MIME 타입이 없는 경우', () => {
      const dataUrlWithoutMime = 'data:;base64,SGVsbG8gV29ybGQ=';
      const blob = convertDataURLToBlob(dataUrlWithoutMime);
      
      expect(blob.type).toBe(''); // 빈 MIME 타입
      expect(blob.size).toBe(11);
    });
  });

  describe('에러 케이스 처리', () => {
    test('null/undefined 입력', () => {
      // @ts-expect-error - 의도적으로 잘못된 타입 테스트
      expect(() => isValidDataURL(null)).not.toThrow();
      // @ts-expect-error - 의도적으로 잘못된 타입 테스트  
      expect(() => extractMimeType(undefined)).not.toThrow();
    });
    
    test('매우 긴 dataURL', () => {
      const longBase64 = 'A'.repeat(10000);
      const longDataURL = `data:text/plain;base64,${longBase64}`;
      
      expect(isValidDataURL(longDataURL)).toBe(true);
      expect(extractMimeType(longDataURL)).toBe('text/plain');
      expect(getDataURLSize(longDataURL)).toBeGreaterThan(7000);
    });
    
    test('특수 문자가 포함된 MIME 타입', () => {
      const specialMimeDataURL = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,abc';
      expect(extractMimeType(specialMimeDataURL)).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    });
  });

  describe('통합 테스트', () => {
    test('전체 파이프라인 테스트', () => {
      const originalText = 'Hello, 안녕하세요!';
      const base64 = btoa(unescape(encodeURIComponent(originalText)));
      const dataURL = `data:text/plain;charset=utf-8;base64,${base64}`;
      
      // 검증
      expect(isValidDataURL(dataURL)).toBe(true);
      expect(extractMimeType(dataURL)).toBe('text/plain');
      expect(isBase64DataURL(dataURL)).toBe(true);
      
      // 변환
      const blob = convertDataURLToBlob(dataURL);
      expect(blob.type).toBe('text/plain');
      
      // 크기 확인 (UTF-8 인코딩으로 인해 바이트 수가 다를 수 있음)
      const calculatedSize = getDataURLSize(dataURL);
      expect(calculatedSize).toBeGreaterThan(originalText.length);
    });
    
    test('라운드트립 테스트 (이론적)', () => {
      // convertDataURLToBlob -> convertBlobToDataURL 라운드트립은 
      // convertBlobToDataURL 함수가 구현되면 테스트 가능
      const originalDataURL = SAMPLE_DATA_URLS.text;
      const blob = convertDataURLToBlob(originalDataURL);
      
      // blob에서 다시 dataURL로 변환하는 함수가 있다면:
      // const newDataURL = convertBlobToDataURL(blob);
      // expect(newDataURL).toBe(originalDataURL);
      
      // 현재는 blob의 기본 속성만 검증
      expect(blob.type).toBe('text/plain');
      expect(blob.size).toBe(11);
    });
  });
});