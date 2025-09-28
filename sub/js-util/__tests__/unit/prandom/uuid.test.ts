import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import {
  uuid,
  uuidv4,
  uuidB62,
  uuidB32,
  uuidDecodeB62,
  uuidDecodeB32,
  uuidIsValid,
  setUuidDefaultEncoding,
  suid,
  suidDate,
  uuid32bit,
  qid,
  uname,
  unameReset,
  uuidBytes,
} from '../../../src/prandom/index.js';

describe('prandom - UUID Functions', () => {
  // 테스트 후 기본 설정 복원
  afterEach(() => {
    setUuidDefaultEncoding('base62', false);
  });

  describe('기본 UUID 생성', () => {
    test('uuidv4() - 표준 UUID v4 형식', () => {
      const id = uuidv4();
      expect(typeof id).toBe('string');

      // UUID v4 패턴: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(id).toMatch(uuidPattern);
    });

    test('uuidBytes() - 16바이트 배열 생성', () => {
      const bytes = uuidBytes();
      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(bytes.length).toBe(16);
    });

    test('uuid32bit() - 32비트 정수', () => {
      const id = uuid32bit();
      expect(typeof id).toBe('number');
      expect(Number.isInteger(id)).toBe(true);
      expect(id).toBeGreaterThanOrEqual(0);
      expect(id).toBeLessThanOrEqual(0xffffffff); // 2^32 - 1
    });
  });

  describe('Base62 인코딩', () => {
    test('uuidB62() - Base62 인코딩된 UUID', () => {
      const id = uuidB62();
      expect(typeof id).toBe('string');
      expect(id.length).toBe(22);

      // Base62 문자만 포함 (0-9, A-Z, a-z)
      expect(id).toMatch(/^[0-9A-Za-z]+$/);
    });

    test('uuidDecodeB62() - Base62 디코딩', () => {
      const originalBytes = uuidBytes();
      const encoded = uuidB62(originalBytes);
      const decoded = uuidDecodeB62(encoded);

      expect(decoded).toEqual(originalBytes);
      expect(decoded.length).toBe(16);
    });

    test('Base62 인코딩/디코딩 일관성', () => {
      for (let i = 0; i < 10; i++) {
        const originalBytes = uuidBytes();
        const encoded = uuidB62(originalBytes);
        const decoded = uuidDecodeB62(encoded);
        expect(decoded).toEqual(originalBytes);
      }
    });
  });

  describe('Base32 인코딩', () => {
    test('uuidB32() - Base32 인코딩된 UUID', () => {
      const id = uuidB32();
      expect(typeof id).toBe('string');
      expect(id.length).toBe(26);
    });

    test('uuidDecodeB32() - Base32 디코딩', () => {
      const originalBytes = uuidBytes();
      const encoded = uuidB32(originalBytes);
      const decoded = uuidDecodeB32(encoded);

      expect(decoded).toEqual(originalBytes);
    });
  });

  describe('기본 인코딩 설정', () => {
    test('기본 설정 - Base62', () => {
      setUuidDefaultEncoding('base62');
      const id = uuid();

      expect(typeof id).toBe('string');
      expect(id.length).toBe(22);
      expect(id).toMatch(/^[0-9A-Za-z]+$/);
    });

    test('Base32로 설정 변경', () => {
      setUuidDefaultEncoding('base32');
      const id = uuid();

      expect(typeof id).toBe('string');
      expect(id.length).toBe(26);
    });

    test('UUIDv4로 설정 변경', () => {
      setUuidDefaultEncoding('uuidv4');
      const id = uuid();

      expect(typeof id).toBe('string');
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    test('정렬 가능한 UUID 설정', () => {
      setUuidDefaultEncoding('base62', true);
      const id = uuid();

      // SUID는 시간 기반이므로 길이는 같음
      expect(typeof id).toBe('string');
      expect(id.length).toBe(22);
    });
  });

  describe('UUID 유효성 검증', () => {
    test('유효한 UUID들', () => {
      expect(uuidIsValid(uuidB62())).toBe(true);
      expect(uuidIsValid(uuidB32())).toBe(true);
    });

    test('무효한 UUID들', () => {
      expect(uuidIsValid('')).toBe(false);
      expect(uuidIsValid('invalid')).toBe(false);
      expect(uuidIsValid('123')).toBe(false);
      expect(uuidIsValid('너무긴문자열'.repeat(10))).toBe(false);
    });
  });

  describe('정렬 가능한 UUID (SUID)', () => {
    test('suid() - 정렬 가능한 ID 생성', () => {
      const id1 = suid();
      const id2 = suid();

      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');

      // 시간순으로 생성되었으므로 사전식 순서도 맞아야 함
      expect(id1 < id2).toBe(true);
    });

    test('suidDate() - SUID에서 생성 시간 추출', () => {
      const beforeTime = Date.now();
      const id = suid();
      const afterTime = Date.now();

      const extractedDate = suidDate(id);

      expect(extractedDate).toBeInstanceOf(Date);
      expect(extractedDate.getTime()).toBeGreaterThanOrEqual(beforeTime - 1000); // 1초 오차 허용
      expect(extractedDate.getTime()).toBeLessThanOrEqual(afterTime + 1000);
    });

    test('연속 SUID들의 시간 순서', () => {
      const ids = Array.from({ length: 5 }, () => suid());
      const times = ids.map((id) => suidDate(id).getTime());

      // 시간이 단조증가해야 함
      for (let i = 1; i < times.length; i++) {
        expect(times[i]).toBeGreaterThanOrEqual(times[i - 1]);
      }
    });
  });

  describe('간단한 카운터 기반 ID', () => {
    test('qid() - 순차적 ID', () => {
      const id1 = qid();
      const id2 = qid();
      const id3 = qid();

      expect(id1).toMatch(/^id-\d+$/);
      expect(id2).toMatch(/^id-\d+$/);
      expect(id3).toMatch(/^id-\d+$/);

      // 순서대로 증가해야 함
      const num1 = parseInt(id1.replace('id-', ''));
      const num2 = parseInt(id2.replace('id-', ''));
      const num3 = parseInt(id3.replace('id-', ''));

      expect(num2).toBe(num1 + 1);
      expect(num3).toBe(num2 + 1);
    });

    test('uname() - 네임드 카운터', () => {
      const id1 = uname('test');
      const id2 = uname('test');
      const id3 = uname('other');

      expect(id1).toBe('test-0');
      expect(id2).toBe('test-1');
      expect(id3).toBe('other-0');
    });

    test('uname() - 기본 이름', () => {
      const id1 = uname();
      const id2 = uname();

      expect(id1).toBe('id-0');
      expect(id2).toBe('id-1');
    });

    test('unameReset() - 카운터 리셋', () => {
      uname('reset-test');
      uname('reset-test');
      expect(uname('reset-test')).toBe('reset-test-2');

      unameReset('reset-test');
      expect(uname('reset-test')).toBe('reset-test-0');
    });
  });

  describe('고유성 테스트', () => {
    test('여러 UUID 생성 시 충돌 없음', () => {
      const uuids = Array.from({ length: 1000 }, () => uuidB62());
      const uniqueUuids = new Set(uuids);

      expect(uniqueUuids.size).toBe(1000); // 모두 고유해야 함
    });

    test('다른 인코딩 방식으로 생성된 UUID들도 고유', () => {
      const base62Ids = Array.from({ length: 100 }, () => uuidB62());
      const base32Ids = Array.from({ length: 100 }, () => uuidB32());

      const allIds = [...base62Ids, ...base32Ids];
      const uniqueIds = new Set(allIds);

      expect(uniqueIds.size).toBe(200);
    });
  });
});
