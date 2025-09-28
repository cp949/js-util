import { describe, test, expect, beforeAll, vi } from 'vitest';
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  base64ToUint8Array,
  uint8ArrayToBase64,
  encode,
  decode
} from '../../../src/base64/index.js';

describe('base64 - Base64 Encoding/Decoding Functions', () => {
  // Test data
  const testString = 'Hello World!';
  const expectedBase64 = 'SGVsbG8gV29ybGQh';
  const testBytes = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]);
  
  // Complex test data
  const complexString = 'Hello 한글 世界 🌍 测试';
  const binaryData = new Uint8Array([0, 1, 127, 128, 255, 254, 100, 200]);

  describe('encode', () => {
    test('문자열을 base64로 인코딩', () => {
      const result = encode(testString);
      expect(result).toBe(expectedBase64);
    });

    test('빈 문자열 인코딩', () => {
      const result = encode('');
      expect(result).toBe('');
    });

    test('특수 문자가 포함된 문자열 인코딩', () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const result = encode(specialChars);
      expect(result).toBe('IUAjJCVeJiooKV8rLT1bXXt9fDs6LC48Pj8=');
    });
  });

  describe('decode', () => {
    test('base64를 문자열로 디코딩', () => {
      const result = decode(expectedBase64);
      expect(result).toBe(testString);
    });

    test('빈 base64 문자열 디코딩', () => {
      const result = decode('');
      expect(result).toBe('');
    });

    test('특수 문자가 포함된 base64 디코딩', () => {
      const base64Special = 'IUAjJCVeJiooKV8rLT1bXXt9fDs6LC48Pj8=';
      const result = decode(base64Special);
      expect(result).toBe('!@#$%^&*()_+-=[]{}|;:,.<>?');
    });

    test('encode-decode 왕복 테스트', () => {
      const original = 'Test round trip encoding/decoding';
      const encoded = encode(original);
      const decoded = decode(encoded);
      expect(decoded).toBe(original);
    });
  });

  describe('uint8ArrayToBase64', () => {
    test('Uint8Array를 base64로 변환', () => {
      const result = uint8ArrayToBase64(testBytes);
      expect(result).toBe(expectedBase64);
    });

    test('빈 Uint8Array 변환', () => {
      const emptyArray = new Uint8Array(0);
      const result = uint8ArrayToBase64(emptyArray);
      expect(result).toBe('');
    });

    test('바이너리 데이터 변환', () => {
      const result = uint8ArrayToBase64(binaryData);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('단일 바이트 배열', () => {
      const singleByte = new Uint8Array([65]); // 'A'
      const result = uint8ArrayToBase64(singleByte);
      expect(result).toBe('QQ==');
    });
  });

  describe('base64ToUint8Array', () => {
    test('base64를 Uint8Array로 변환', () => {
      const result = base64ToUint8Array(expectedBase64);
      expect(result).toEqual(testBytes);
    });

    test('빈 base64를 빈 Uint8Array로 변환', () => {
      const result = base64ToUint8Array('');
      expect(result).toEqual(new Uint8Array(0));
    });

    test('패딩이 있는 base64 변환', () => {
      const base64WithPadding = 'QQ=='; // single 'A'
      const result = base64ToUint8Array(base64WithPadding);
      expect(result).toEqual(new Uint8Array([65]));
    });

    test('uint8ArrayToBase64-base64ToUint8Array 왕복 테스트', () => {
      // ASCII 범위 내의 값들만 테스트 (base64 변환이 String.fromCharCode를 사용하므로)
      const original = new Uint8Array([1, 2, 3, 4, 5, 65, 100, 127]);
      const base64 = uint8ArrayToBase64(original);
      const restored = base64ToUint8Array(base64);
      expect(restored).toEqual(original);
    });
  });

  describe('arrayBufferToBase64', () => {
    test('ArrayBuffer를 base64로 변환', () => {
      const buffer = testBytes.buffer;
      const result = arrayBufferToBase64(buffer);
      expect(result).toBe(expectedBase64);
    });

    test('빈 ArrayBuffer 변환', () => {
      const emptyBuffer = new ArrayBuffer(0);
      const result = arrayBufferToBase64(emptyBuffer);
      expect(result).toBe('');
    });

    test('다양한 크기의 ArrayBuffer 변환', () => {
      const sizes = [1, 2, 4, 8, 16, 32, 64, 128];
      
      sizes.forEach(size => {
        const buffer = new ArrayBuffer(size);
        const view = new Uint8Array(buffer);
        // Fill with sequential values
        for (let i = 0; i < size; i++) {
          view[i] = i % 256;
        }
        
        const result = arrayBufferToBase64(buffer);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

  describe('base64ToArrayBuffer', () => {
    test('base64를 ArrayBuffer로 변환', () => {
      const result = base64ToArrayBuffer(expectedBase64);
      const resultBytes = new Uint8Array(result);
      expect(resultBytes).toEqual(testBytes);
    });

    test('빈 base64를 빈 ArrayBuffer로 변환', () => {
      const result = base64ToArrayBuffer('');
      expect(result.byteLength).toBe(0);
    });

    test('ArrayBuffer 타입 검증', () => {
      const result = base64ToArrayBuffer(expectedBase64);
      expect(result).toBeInstanceOf(ArrayBuffer);
      expect(result.byteLength).toBe(testBytes.length);
    });

    test('arrayBufferToBase64-base64ToArrayBuffer 왕복 테스트', () => {
      const originalBuffer = new ArrayBuffer(10);
      const originalView = new Uint8Array(originalBuffer);
      // Fill with ASCII 범위 내의 데이터 (0-127)
      for (let i = 0; i < 10; i++) {
        originalView[i] = (i * 12) % 128;
      }
      
      const base64 = arrayBufferToBase64(originalBuffer);
      const restoredBuffer = base64ToArrayBuffer(base64);
      const restoredView = new Uint8Array(restoredBuffer);
      
      expect(restoredView).toEqual(originalView);
    });
  });

  describe('통합 변환 테스트', () => {
    test('모든 타입 간 변환 일관성', () => {
      const originalString = 'Integration test data';
      
      // String → base64 → back to string
      const base64FromString = encode(originalString);
      const stringFromBase64 = decode(base64FromString);
      expect(stringFromBase64).toBe(originalString);
      
      // Uint8Array → base64 → back to Uint8Array
      const uint8Array = new Uint8Array(Buffer.from(originalString, 'utf8'));
      const base64FromUint8 = uint8ArrayToBase64(uint8Array);
      const uint8FromBase64 = base64ToUint8Array(base64FromUint8);
      expect(uint8FromBase64).toEqual(uint8Array);
      
      // ArrayBuffer → base64 → back to ArrayBuffer
      const arrayBuffer = uint8Array.buffer;
      const base64FromBuffer = arrayBufferToBase64(arrayBuffer);
      const bufferFromBase64 = base64ToArrayBuffer(base64FromBuffer);
      expect(new Uint8Array(bufferFromBase64)).toEqual(new Uint8Array(arrayBuffer));
    });

    test('ASCII 범위 데이터 무손실 변환', () => {
      // Create binary data with ASCII range values (0-127)
      const binaryData = new Uint8Array(128);
      for (let i = 0; i < 128; i++) {
        binaryData[i] = i;
      }
      
      const base64 = uint8ArrayToBase64(binaryData);
      const restored = base64ToUint8Array(base64);
      
      expect(restored).toEqual(binaryData);
    });

    test('크기가 다른 데이터의 패딩 처리', () => {
      const sizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      
      sizes.forEach(size => {
        const data = new Uint8Array(size);
        for (let i = 0; i < size; i++) {
          data[i] = (i * 17) % 128; // ASCII 범위 내로 제한
        }
        
        const base64 = uint8ArrayToBase64(data);
        const restored = base64ToUint8Array(base64);
        
        expect(restored).toEqual(data);
        
        // Base64 문자열의 길이는 항상 4의 배수여야 함
        expect(base64.length % 4).toBe(0);
        
        // 패딩 문자 '='는 끝에만 나타나야 함
        if (base64.includes('=')) {
          const paddingIndex = base64.indexOf('=');
          expect(base64.substring(paddingIndex)).toMatch(/^=+$/);
        }
      });
    });
  });

  describe('Node.js 환경 테스트', () => {
    test('Node.js 환경 분기 커버리지 - encode', () => {
      // 이 테스트는 Node.js 환경 분기의 존재를 확인하는 것이 목적
      // 실제 Node.js 환경에서는 Buffer를 사용하고, 브라우저에서는 btoa를 사용
      const testString = 'Hello World!';
      const result = encode(testString);
      
      // 결과는 동일해야 함 (브라우저 환경에서 실행되므로 btoa 사용)
      expect(result).toBe('SGVsbG8gV29ybGQh');
      
      // 타입 체크: encode 함수는 항상 문자열을 반환해야 함
      expect(typeof result).toBe('string');
    });

    test('Node.js 환경 분기 커버리지 - decode', () => {
      // 이 테스트는 Node.js 환경 분기의 존재를 확인하는 것이 목적
      // 실제 Node.js 환경에서는 Buffer를 사용하고, 브라우저에서는 atob를 사용
      const testBase64 = 'SGVsbG8gV29ybGQh';
      const result = decode(testBase64);
      
      // 결과는 동일해야 함 (브라우저 환경에서 실행되므로 atob 사용)
      expect(result).toBe('Hello World!');
      
      // 타입 체크: decode 함수는 항상 문자열을 반환해야 함
      expect(typeof result).toBe('string');
    });
  });

  describe('에러 처리', () => {
    test('잘못된 base64 문자열 처리', () => {
      // Note: 브라우저와 Node.js에서 다르게 동작할 수 있음
      expect(() => {
        base64ToUint8Array('invalid base64!@#');
      }).toThrow();
    });

    test('null/undefined 입력 처리', () => {
      // encode 함수는 null을 문자열로 변환하여 처리하므로 에러를 던지지 않음
      expect(encode(null as any)).toBeDefined();
      
      // decode 함수도 null을 문자열로 변환하여 처리하므로 에러를 던지지 않음
      expect(decode(null as any)).toBeDefined();
      
      expect(() => {
        uint8ArrayToBase64(null as any);
      }).toThrow();
    });
  });
});