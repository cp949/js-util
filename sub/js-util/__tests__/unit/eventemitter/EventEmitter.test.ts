import { describe, test, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from '../../../src/eventemitter/index.js';

// 테스트용 이벤트 타입 정의
interface TestEvents {
  'test-event': [string, number];
  'test-event2': [any];
  'test-event3': [any];
  'data-event': [{ id: number; name: string }];
  'no-args-event': [];
  'multiple-args': [string, number, boolean, object];
}

describe('eventemitter - EventEmitter Class', () => {
  let emitter: EventEmitter<TestEvents>;

  beforeEach(() => {
    emitter = new EventEmitter<TestEvents>();
  });

  describe('기본 이벤트 등록 및 발생', () => {
    test('on() 메서드로 리스너 등록 및 emit()으로 발생', () => {
      const mockListener = vi.fn();

      emitter.on('test-event', mockListener);
      emitter.emit('test-event', 'hello', 42);

      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(mockListener).toHaveBeenCalledWith('hello', 42);
    });

    test('addListener() 메서드도 동일하게 동작', () => {
      const mockListener = vi.fn();

      emitter.addListener('test-event', mockListener);
      emitter.emit('test-event', 'world', 100);

      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(mockListener).toHaveBeenCalledWith('world', 100);
    });

    test('여러 리스너 등록 및 모두 호출', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();

      emitter.on('test-event', listener1);
      emitter.on('test-event', listener2);
      emitter.on('test-event', listener3);

      emitter.emit('test-event', 'broadcast', 123);

      expect(listener1).toHaveBeenCalledWith('broadcast', 123);
      expect(listener2).toHaveBeenCalledWith('broadcast', 123);
      expect(listener3).toHaveBeenCalledWith('broadcast', 123);
    });

    test('인수 없는 이벤트', () => {
      const mockListener = vi.fn();

      emitter.on('no-args-event', mockListener);
      emitter.emit('no-args-event');

      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(mockListener).toHaveBeenCalledWith();
    });

    test('복잡한 객체 전달', () => {
      const mockListener = vi.fn();
      const testData = { id: 1, name: 'test user' };

      emitter.on('data-event', mockListener);
      emitter.emit('data-event', testData);

      expect(mockListener).toHaveBeenCalledWith(testData);
    });
  });

  describe('once() 메서드 - 일회성 리스너', () => {
    test('once 리스너는 한 번만 실행', () => {
      const mockListener = vi.fn();

      emitter.once('test-event', mockListener);

      emitter.emit('test-event', 'first', 1);
      emitter.emit('test-event', 'second', 2);
      emitter.emit('test-event', 'third', 3);

      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(mockListener).toHaveBeenCalledWith('first', 1);
    });

    test('일반 리스너와 once 리스너 혼합', () => {
      const normalListener = vi.fn();
      const onceListener = vi.fn();

      emitter.on('test-event', normalListener);
      emitter.once('test-event', onceListener);

      emitter.emit('test-event', 'test', 1);
      emitter.emit('test-event', 'test', 2);

      expect(normalListener).toHaveBeenCalledTimes(2);
      expect(onceListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('리스너 제거', () => {
    test('removeListener()로 특정 리스너 제거', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      emitter.on('test-event', listener1);
      emitter.on('test-event', listener2);

      emitter.removeListener('test-event', listener1);
      emitter.emit('test-event', 'test', 1);

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledWith('test', 1);
    });

    test('off() 메서드도 동일하게 동작', () => {
      const mockListener = vi.fn();

      emitter.on('test-event', mockListener);
      emitter.off('test-event', mockListener);
      emitter.emit('test-event', 'test', 1);

      expect(mockListener).not.toHaveBeenCalled();
    });

    test('removeAllListeners()로 특정 이벤트의 모든 리스너 제거', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const otherListener = vi.fn();

      emitter.on('test-event', listener1);
      emitter.on('test-event', listener2);
      emitter.on('data-event', otherListener);

      emitter.removeAllListeners('test-event');

      emitter.emit('test-event', 'test', 1);
      emitter.emit('data-event', { id: 1, name: 'test' });

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
      expect(otherListener).toHaveBeenCalled();
    });

    test('removeAllListeners() 인수 없이 호출하면 모든 리스너 제거', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      emitter.on('test-event', listener1);
      emitter.on('data-event', listener2);

      emitter.removeAllListeners();

      emitter.emit('test-event', 'test', 1);
      emitter.emit('data-event', { id: 1, name: 'test' });

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });

    test('존재하지 않는 리스너 제거해도 에러 없음', () => {
      const mockListener = vi.fn();

      expect(() => {
        emitter.removeListener('test-event', mockListener);
      }).not.toThrow();
    });
  });

  describe('메서드 반환값', () => {
    test('on(), addListener(), once() 메서드는 this를 반환 (체이닝 지원)', () => {
      const mockListener = vi.fn();

      const result1 = emitter.on('test-event', mockListener);
      const result2 = emitter.addListener('test-event2', mockListener);
      const result3 = emitter.once('test-event3', mockListener);

      expect(result1).toBe(emitter);
      expect(result2).toBe(emitter);
      expect(result3).toBe(emitter);
    });

    test('removeListener(), off(), removeAllListeners()도 this를 반환', () => {
      const mockListener = vi.fn();
      emitter.on('test-event', mockListener);

      const result1 = emitter.removeListener('test-event', mockListener);
      const result2 = emitter.off('test-event2');
      const result3 = emitter.removeAllListeners();

      expect(result1).toBe(emitter);
      expect(result2).toBe(emitter);
      expect(result3).toBe(emitter);
    });
  });

  describe('컨텍스트 지원', () => {
    test('리스너에 컨텍스트 바인딩', () => {
      const context = { value: 'test-context' };
      let capturedThis: any;

      function testListener(this: any) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        capturedThis = this;
      }

      emitter.on('test-event', testListener, context);
      emitter.emit('test-event', 'test', 1);

      expect(capturedThis).toBe(context);
    });

    test('컨텍스트별 리스너 제거', () => {
      const context1 = { id: 1 };
      const context2 = { id: 2 };
      const listener = vi.fn();

      emitter.on('test-event', listener, context1);
      emitter.on('test-event', listener, context2);

      emitter.removeListener('test-event', listener, context1);
      emitter.emit('test-event', 'test', 1);

      // context2의 리스너만 실행되어야 함
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('정보 조회 메서드들', () => {
    test('eventNames() - 등록된 이벤트 이름들 반환', () => {
      expect(emitter.eventNames()).toEqual([]);

      emitter.on('test-event', vi.fn());
      emitter.on('data-event', vi.fn());

      const eventNames = emitter.eventNames();
      expect(eventNames).toContain('test-event');
      expect(eventNames).toContain('data-event');
      expect(eventNames).toHaveLength(2);
    });

    test('listeners() - 특정 이벤트의 리스너들 반환', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      expect(emitter.listeners('test-event')).toEqual([]);

      emitter.on('test-event', listener1);
      emitter.on('test-event', listener2);

      const listeners = emitter.listeners('test-event');
      expect(listeners).toContain(listener1);
      expect(listeners).toContain(listener2);
      expect(listeners).toHaveLength(2);
    });

    test('listenerCount() - 특정 이벤트의 리스너 개수 반환', () => {
      expect(emitter.listenerCount('test-event')).toBe(0);

      emitter.on('test-event', vi.fn());
      expect(emitter.listenerCount('test-event')).toBe(1);

      emitter.on('test-event', vi.fn());
      expect(emitter.listenerCount('test-event')).toBe(2);

      emitter.once('test-event', vi.fn());
      expect(emitter.listenerCount('test-event')).toBe(3);
    });
  });

  describe('emit() 반환값', () => {
    test('리스너가 있으면 true 반환', () => {
      emitter.on('test-event', vi.fn());

      const result = emitter.emit('test-event', 'test', 1);
      expect(result).toBe(true);
    });

    test('리스너가 없으면 false 반환', () => {
      const result = emitter.emit('test-event', 'test', 1);
      expect(result).toBe(false);
    });
  });

  describe('에러 처리', () => {
    test('리스너가 함수가 아니면 TypeError', () => {
      expect(() => {
        // @ts-expect-error - 의도적으로 잘못된 타입 테스트
        emitter.on('test-event', 'not-a-function');
      }).toThrow(TypeError);

      expect(() => {
        // @ts-expect-error - 의도적으로 잘못된 타입 테스트
        emitter.once('test-event', null);
      }).toThrow(TypeError);
    });

    test('리스너에서 에러가 발생해도 다른 리스너에 영향 없음', () => {
      const errorListener = vi.fn(() => {
        throw new Error('Test error');
      });
      const normalListener = vi.fn();

      emitter.on('test-event', errorListener);
      emitter.on('test-event', normalListener);

      expect(() => {
        emitter.emit('test-event', 'test', 1);
      }).toThrow('Test error');

      expect(errorListener).toHaveBeenCalled();
      expect(normalListener).toHaveBeenCalled();
    });
  });

  describe('메모리 누수 방지', () => {
    test('once 리스너는 실행 후 자동 제거', () => {
      const mockListener = vi.fn();

      emitter.once('test-event', mockListener);
      expect(emitter.listenerCount('test-event')).toBe(1);

      emitter.emit('test-event', 'test', 1);
      expect(emitter.listenerCount('test-event')).toBe(0);
    });

    test('모든 리스너 제거 후 내부 상태 정리', () => {
      emitter.on('test-event', vi.fn());
      emitter.on('data-event', vi.fn());

      emitter.removeAllListeners();

      expect(emitter.eventNames()).toEqual([]);
      expect(emitter.listenerCount('test-event')).toBe(0);
      expect(emitter.listenerCount('data-event')).toBe(0);
    });
  });

  describe('대량 처리 성능', () => {
    test('많은 수의 리스너 처리', () => {
      const listeners = Array.from({ length: 1000 }, () => vi.fn());

      // 1000개의 리스너 등록
      listeners.forEach((listener) => {
        emitter.on('test-event', listener);
      });

      expect(emitter.listenerCount('test-event')).toBe(1000);

      // 모든 리스너 실행
      const startTime = performance.now();
      emitter.emit('test-event', 'performance test', 42);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // 100ms 이내

      // 모든 리스너가 호출되었는지 확인
      listeners.forEach((listener) => {
        expect(listener).toHaveBeenCalledWith('performance test', 42);
      });
    });

    test('많은 이벤트 타입 처리', () => {
      const eventCount = 1000;
      const listeners = Array.from({ length: eventCount }, () => vi.fn());

      // 1000개의 서로 다른 이벤트에 리스너 등록
      listeners.forEach((listener, index) => {
        emitter.on(`event-${index}` as any, listener);
      });

      expect(emitter.eventNames()).toHaveLength(eventCount);

      // 모든 이벤트 발생
      listeners.forEach((listener, index) => {
        emitter.emit(`event-${index}` as any, `data-${index}`);
        expect(listener).toHaveBeenCalledWith(`data-${index}`);
      });
    });
  });

  describe('Symbol 이벤트 이름 지원', () => {
    test('Symbol을 이벤트 이름으로 사용 가능', () => {
      const symbolEvent = Symbol('test-symbol-event');
      const emitterWithSymbol = new EventEmitter<string | symbol>();
      const mockListener = vi.fn();

      emitterWithSymbol.on(symbolEvent, mockListener);
      emitterWithSymbol.emit(symbolEvent, 'symbol test');

      expect(mockListener).toHaveBeenCalledWith('symbol test');
      expect(emitterWithSymbol.listenerCount(symbolEvent)).toBe(1);
    });
  });

  describe('체이닝 지원', () => {
    test('메서드 체이닝 가능', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();

      const result = emitter
        .on('test-event', listener1)
        .removeListener('test-event', listener1)
        .on('test-event', listener2)
        .on('data-event', listener3)
        .removeAllListeners('data-event');

      expect(result).toBe(emitter);

      emitter.emit('test-event', 'chain test', 1);
      emitter.emit('data-event', { id: 1, name: 'test' });

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
      expect(listener3).not.toHaveBeenCalled();
    });
  });
});
