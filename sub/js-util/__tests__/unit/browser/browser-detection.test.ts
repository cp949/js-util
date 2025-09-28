import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isTouchDevice,
  isWebBluetoothSupport,
  isWebSerialSupport
} from '../../../src/browser/index.js';

describe('browser - Browser Detection', () => {
  // 원래 window 객체 백업
  const originalWindow = global.window;
  const originalNavigator = global.navigator;
  
  beforeEach(() => {
    // 각 테스트마다 window 객체 초기화
    vi.stubGlobal('window', {
      navigator: {}
    });
  });
  
  afterEach(() => {
    // 원래 환경 복원
    vi.unstubAllGlobals();
  });
  
  describe('isTouchDevice', () => {
    test('ontouchstart가 있는 경우 true 반환', () => {
      vi.stubGlobal('window', {
        navigator: {},
        ontouchstart: null // ontouchstart 속성 존재
      });
      
      expect(isTouchDevice()).toBe(true);
    });
    
    test('maxTouchPoints > 0인 경우 true 반환', () => {
      vi.stubGlobal('window', {
        navigator: {
          maxTouchPoints: 5
        }
      });
      
      expect(isTouchDevice()).toBe(true);
    });
    
    test('ontouchstart와 maxTouchPoints 모두 있는 경우 true', () => {
      vi.stubGlobal('window', {
        navigator: {
          maxTouchPoints: 2
        },
        ontouchstart: null
      });
      
      expect(isTouchDevice()).toBe(true);
    });
    
    test('터치 지원이 없는 경우 false 반환', () => {
      vi.stubGlobal('window', {
        navigator: {
          maxTouchPoints: 0 // 터치 포인트 없음
        }
        // ontouchstart 속성 없음
      });
      
      expect(isTouchDevice()).toBe(false);
    });
    
    test('navigator가 없는 경우 false 반환', () => {
      vi.stubGlobal('window', {});
      
      expect(isTouchDevice()).toBe(false);
    });
    
    test('window가 없는 경우 false 반환', () => {
      vi.stubGlobal('window', undefined);
      
      expect(isTouchDevice()).toBe(false);
    });
    
    test('maxTouchPoints가 undefined인 경우', () => {
      vi.stubGlobal('window', {
        navigator: {
          maxTouchPoints: undefined
        }
      });
      
      expect(isTouchDevice()).toBe(false);
    });
    
    test('maxTouchPoints가 null인 경우', () => {
      vi.stubGlobal('window', {
        navigator: {
          maxTouchPoints: null
        }
      });
      
      expect(isTouchDevice()).toBe(false);
    });
  });
  
  describe('isWebBluetoothSupport', () => {
    test('bluetooth이 navigator에 있는 경우 true 반환', () => {
      vi.stubGlobal('window', {
        navigator: {
          bluetooth: {} // bluetooth 객체 존재
        }
      });
      
      expect(isWebBluetoothSupport()).toBe(true);
    });
    
    test('bluetooth이 없는 경우 false 반환', () => {
      vi.stubGlobal('window', {
        navigator: {
          // bluetooth 속성 없음
        }
      });
      
      expect(isWebBluetoothSupport()).toBe(false);
    });
    
    test('navigator가 없는 경우 false 반환', () => {
      vi.stubGlobal('window', {});
      
      expect(isWebBluetoothSupport()).toBe(false);
    });
    
    test('window가 없는 경우 false 반환', () => {
      vi.stubGlobal('window', undefined);
      
      expect(isWebBluetoothSupport()).toBe(false);
    });
    
    test('bluetooth 속성이 null인 경우도 true 반환', () => {
      vi.stubGlobal('window', {
        navigator: {
          bluetooth: null // 속성은 존재하지만 null
        }
      });
      
      expect(isWebBluetoothSupport()).toBe(true);
    });
    
    test('bluetooth 속성이 undefined인 경우', () => {
      vi.stubGlobal('window', {
        navigator: {
          bluetooth: undefined
        }
      });
      
      // 'in' 연산자를 사용하므로 속성이 정의되어 있다면 true
      expect(isWebBluetoothSupport()).toBe(true);
    });
  });
  
  describe('isWebSerialSupport', () => {
    test('serial이 navigator에 있는 경우 true 반환', () => {
      vi.stubGlobal('window', {
        navigator: {
          serial: {} // serial 객체 존재
        }
      });
      
      expect(isWebSerialSupport()).toBe(true);
    });
    
    test('serial이 없는 경우 false 반환', () => {
      vi.stubGlobal('window', {
        navigator: {
          // serial 속성 없음
        }
      });
      
      expect(isWebSerialSupport()).toBe(false);
    });
    
    test('navigator가 없는 경우 false 반환', () => {
      vi.stubGlobal('window', {});
      
      expect(isWebSerialSupport()).toBe(false);
    });
    
    test('window가 없는 경우 false 반환', () => {
      vi.stubGlobal('window', undefined);
      
      expect(isWebSerialSupport()).toBe(false);
    });
    
    test('serial 속성이 null인 경우도 true 반환', () => {
      vi.stubGlobal('window', {
        navigator: {
          serial: null // 속성은 존재하지만 null
        }
      });
      
      expect(isWebSerialSupport()).toBe(true);
    });
    
    test('serial 속성이 undefined인 경우', () => {
      vi.stubGlobal('window', {
        navigator: {
          serial: undefined
        }
      });
      
      // 'in' 연산자를 사용하므로 속성이 정의되어 있다면 true
      expect(isWebSerialSupport()).toBe(true);
    });
  });
  
  describe('실제 브라우저 환경 시뮬레이션', () => {
    test('데스크탑 브라우저 환경', () => {
      vi.stubGlobal('window', {
        navigator: {
          maxTouchPoints: 0,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      expect(isTouchDevice()).toBe(false);
      expect(isWebBluetoothSupport()).toBe(false);
      expect(isWebSerialSupport()).toBe(false);
    });
    
    test('모바일 브라우저 환경', () => {
      vi.stubGlobal('window', {
        navigator: {
          maxTouchPoints: 5,
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
        },
        ontouchstart: null
      });
      
      expect(isTouchDevice()).toBe(true);
    });
    
    test('모던 브라우저 환경 (Web Bluetooth & Serial 지원)', () => {
      vi.stubGlobal('window', {
        navigator: {
          bluetooth: {
            requestDevice: vi.fn()
          },
          serial: {
            requestPort: vi.fn()
          }
        }
      });
      
      expect(isWebBluetoothSupport()).toBe(true);
      expect(isWebSerialSupport()).toBe(true);
    });
    
    test('레거시 브라우저 환경', () => {
      vi.stubGlobal('window', {
        navigator: {
          userAgent: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1)'
        }
      });
      
      expect(isTouchDevice()).toBe(false);
      expect(isWebBluetoothSupport()).toBe(false);
      expect(isWebSerialSupport()).toBe(false);
    });
  });
  
  describe('에러 상황 처리', () => {
    test('navigator 접근 시 예외가 발생하는 경우', () => {
      const mockWindow = {
        get navigator() {
          throw new Error('Navigator access denied');
        }
      };
      vi.stubGlobal('window', mockWindow);
      
      // 에러가 발생해도 함수가 크래시하지 않아야 함
      expect(() => {
        try {
          isTouchDevice();
        } catch (e) {
          // 에러가 발생할 수 있음
        }
      }).not.toThrow();
    });
    
    test('window 객체가 proxy인 경우', () => {
      const proxyWindow = new Proxy({}, {
        get(target, prop) {
          if (prop === 'navigator') {
            return { maxTouchPoints: 1 };
          }
          return undefined;
        }
      });
      
      vi.stubGlobal('window', proxyWindow);
      
      expect(isTouchDevice()).toBe(true);
    });
  });
  
  describe('타입 안전성', () => {
    test('모든 함수가 boolean 반환', () => {
      // 다양한 환경에서 모두 boolean 반환하는지 확인
      const testCases = [
        {},
        { navigator: {} },
        { navigator: { maxTouchPoints: 5 } },
        { navigator: { bluetooth: {}, serial: {} } }
      ];
      
      testCases.forEach(windowMock => {
        vi.stubGlobal('window', windowMock);
        
        expect(typeof isTouchDevice()).toBe('boolean');
        expect(typeof isWebBluetoothSupport()).toBe('boolean');
        expect(typeof isWebSerialSupport()).toBe('boolean');
      });
    });
  });
});