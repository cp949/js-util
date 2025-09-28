import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '../../../src/fn/index.js';

describe('fn - debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  describe('기본 동작', () => {
    test('함수가 아닌 값 전달 시 TypeError', () => {
      expect(() => debounce(123 as any)).toThrow(TypeError);
      expect(() => debounce('not a function' as any)).toThrow(TypeError);
      expect(() => debounce(null as any)).toThrow(TypeError);
    });
    
    test('wait 시간 후에 함수 실행', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledOnce();
    });
    
    test('연속 호출 시 마지막 호출만 실행', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn('first');
      debouncedFn('second');
      debouncedFn('third');
      
      vi.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledOnce();
      expect(mockFn).toHaveBeenCalledWith('third');
    });
    
    test('wait 시간 전 호출 시 타이머 재시작', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      vi.advanceTimersByTime(50); // 50ms 후
      
      debouncedFn(); // 다시 호출하면 타이머 재시작
      vi.advanceTimersByTime(50); // 추가 50ms (총 100ms)
      
      expect(mockFn).not.toHaveBeenCalled(); // 아직 실행 안됨
      
      vi.advanceTimersByTime(50); // 추가 50ms (재시작 후 100ms)
      expect(mockFn).toHaveBeenCalledOnce();
    });
  });
  
  describe('leading 옵션', () => {
    test('leading: true - 첫 호출 즉시 실행', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true });
      
      debouncedFn();
      expect(mockFn).toHaveBeenCalledOnce(); // 즉시 실행
      
      debouncedFn();
      debouncedFn();
      
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledOnce(); // trailing은 false가 기본값이므로
    });
    
    test('leading: true, trailing: true - 처음과 끝 모두 실행', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, trailing: true });
      
      debouncedFn('first');
      expect(mockFn).toHaveBeenCalledWith('first');
      
      debouncedFn('second');
      debouncedFn('third');
      
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('third');
    });
    
    test('leading: false, trailing: false - 실행 안됨', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: false, trailing: false });
      
      debouncedFn();
      vi.advanceTimersByTime(100);
      
      expect(mockFn).not.toHaveBeenCalled();
    });
  });
  
  describe('maxWait 옵션', () => {
    test('maxWait로 최대 대기 시간 제한', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { maxWait: 200 });
      
      // 계속 호출하여 debounce 지연
      debouncedFn();
      vi.advanceTimersByTime(90);
      debouncedFn();
      vi.advanceTimersByTime(90);
      debouncedFn();
      vi.advanceTimersByTime(90); // 총 270ms
      
      // maxWait(200ms)를 초과했으므로 실행되어야 함
      expect(mockFn).toHaveBeenCalled();
    });
    
    test('maxWait가 wait보다 작을 때 wait 값 사용', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 200, { maxWait: 100 }); // maxWait < wait
      
      debouncedFn();
      vi.advanceTimersByTime(150);
      
      // maxWait가 wait로 조정되므로 200ms 후에 실행
      expect(mockFn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalled();
    });
  });
  
  describe('cancel 메서드', () => {
    test('cancel 호출 시 대기 중인 함수 취소', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      debouncedFn.cancel();
      
      vi.advanceTimersByTime(100);
      expect(mockFn).not.toHaveBeenCalled();
    });
    
    test('cancel 후 다시 호출 가능', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn('first');
      debouncedFn.cancel();
      
      debouncedFn('second');
      vi.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledOnce();
      expect(mockFn).toHaveBeenCalledWith('second');
    });
  });
  
  describe('flush 메서드', () => {
    test('flush 호출 시 대기 중인 함수 즉시 실행', () => {
      const mockFn = vi.fn().mockReturnValue('result');
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn('test');
      const result = debouncedFn.flush();
      
      expect(mockFn).toHaveBeenCalledWith('test');
      expect(result).toBe('result');
    });
    
    test('flush 호출 시 대기 중인 함수가 없으면 이전 결과 반환', () => {
      const mockFn = vi.fn().mockReturnValue('result');
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      vi.advanceTimersByTime(100); // 정상 실행
      
      const result = debouncedFn.flush(); // 대기 중인 함수 없음
      expect(result).toBe('result');
    });
  });
  
  describe('this 컨텍스트와 반환값', () => {
    test('원본 함수의 this 컨텍스트 유지', () => {
      const context = { value: 42 };
      const mockFn = vi.fn(function(this: typeof context) {
        return this.value;
      });
      
      const debouncedFn = debounce(mockFn, 100);
      debouncedFn.call(context);
      
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledOnce();
    });
    
    test('반환값 처리', () => {
      const mockFn = vi.fn().mockReturnValue('return value');
      const debouncedFn = debounce(mockFn, 100, { leading: true });
      
      const result = debouncedFn();
      expect(result).toBe('return value');
    });
    
    test('인자 전달 확인', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn('arg1', 'arg2', 'arg3');
      vi.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    });
  });
  
  describe('엣지 케이스', () => {
    test('wait이 0일 때 다음 틱에 실행', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 0);
      
      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(0);
      expect(mockFn).toHaveBeenCalledOnce();
    });
    
    test('wait 기본값 확인', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn);
      
      debouncedFn();
      vi.advanceTimersByTime(0);
      
      expect(mockFn).toHaveBeenCalledOnce();
    });
    
    test('여러 debounced 함수 독립적 동작', () => {
      const mockFn1 = vi.fn();
      const mockFn2 = vi.fn();
      const debouncedFn1 = debounce(mockFn1, 100);
      const debouncedFn2 = debounce(mockFn2, 200);
      
      debouncedFn1();
      debouncedFn2();
      
      vi.advanceTimersByTime(100);
      expect(mockFn1).toHaveBeenCalledOnce();
      expect(mockFn2).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(100);
      expect(mockFn2).toHaveBeenCalledOnce();
    });
  });
});