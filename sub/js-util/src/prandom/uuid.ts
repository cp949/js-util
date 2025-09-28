import { decodeB32, decodeB62, encodeB32, encodeB62, stringToUInt8Array } from '../basex/basex.js';
import { randomUint8Array } from './randomUint8Array.js';

// eslint-disable-next-line no-var
declare var Buffer: any;

/**
 * 다양한 유형의 바이너리 입력 데이터를 Uint8Array로 변환합니다.
 *
 * @param data - 변환할 데이터. ArrayBuffer, string, number 배열 또는 Uint8Array를 지원합니다.
 * @returns Uint8Array로 변환된 데이터입니다.
 */
export function toUint8Array(data: Uint8Array | ArrayBuffer | string | number[]): Uint8Array {
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (typeof data === 'string') return stringToUInt8Array(data);
  if (data.length) return new Uint8Array(data);
  return data as Uint8Array;
}

/**
 * 바이너리 데이터를 16진수 문자열로 변환합니다.
 *
 * @param bin - 변환할 바이너리 데이터입니다.
 * @returns 16진수 문자열로 변환된 데이터입니다.
 */
function toHex(bin: Uint8Array | ArrayBuffer | string | number[]): string {
  if (typeof Buffer !== 'undefined') return Buffer.from(toUint8Array(bin)).toString('hex');
  const h = '0123456789abcdef';
  let s = '';
  for (const v of [...toUint8Array(bin)]) s += h[v >> 4] + h[v & 15];
  return s;
}

/**
 * 16진수 문자열 데이터를 Uint8Array로 변환합니다.
 *
 * @param hexString - 변환할 16진수 문자열입니다.
 * @returns Uint8Array로 변환된 데이터입니다.
 */
function fromHex(hexString: string): Uint8Array {
  return Uint8Array.from(hexString.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)));
}

// 128 bit UUID

const uuidBytesLength = 16;

/**
 * UUID를 랜덤 바이트 배열로 생성합니다.
 *
 * @returns 길이가 16인 랜덤 바이트 배열입니다.
 */
export function uuidBytes(): Uint8Array {
  return randomUint8Array(uuidBytesLength);
}

/**
 * 랜덤으로 생성된 UUID를 Base62 형식의 문자열로 인코딩합니다.
 *
 * @param bytes - UUID 바이트 배열 (기본값: 랜덤 생성된 UUID 바이트 배열).
 * @returns Base62 형식으로 인코딩된 문자열입니다.
 */
export function uuidB62(bytes = uuidBytes()): string {
  return encodeB62(bytes, 22);
}

/**
 * Base62로 인코딩된 UUID 문자열을 디코딩하여 Uint8Array로 변환합니다.
 *
 * @param uuid - Base62로 인코딩된 UUID 문자열입니다.
 * @returns 디코딩된 Uint8Array입니다.
 */
export function uuidDecodeB62(uuid: string): Uint8Array {
  return decodeB62(uuid, uuidBytesLength);
}

// Base32

export function uuidB32(bytes = uuidBytes()): string {
  return encodeB32(bytes, 26);
}

export function uuidDecodeB32(uuid: string): Uint8Array {
  return decodeB32(uuid, uuidBytesLength);
}

// UUIDv4

// https://stackoverflow.com/a/2117523/140927
const pattern = '10000000-1000-4000-8000-100000000000'; // String([1e7] + -1e3 + -4e3 + -8e3 + -1e11)

export const uuidv4 = function () {
  return typeof crypto !== 'undefined' && crypto.randomUUID != null
    ? crypto.randomUUID() // native!
    : pattern.replace(/[018]/g, (c: any) =>
        (c ^ (randomUint8Array(1)[0] & (15 >> (c / 4)))).toString(16),
      );
};

export function uuidEncodeV4(bytes: Uint8Array): string {
  const id = toHex(bytes);
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`; // 10000000 - 1000 - 4000 - 8000 - 100000000000
}

export function uuidDecodeV4(uuid: string): Uint8Array {
  return fromHex(uuid.replace(/-/g, ''));
}

// Sortable UID

// https://github.com/segmentio/ksuid
// https://pkg.go.dev/github.com/rsms/go-uuid

/**
 * Sortable unique ID
 * Inspired by https://github.com/rsms/go-uuid
 *
 * Bytes 0-5:  Current time in miliseconds from 2021-06-01T00:00:00Z
 * Bytes 6-15: Random
 */

// 1622505600000 //  new Date('2021-06-01T00:00:00Z').getTime()
const ReferenceDateInMS = 1600000000000;

// 6 bytes will stay valid until end of time: new Date(1622505600000 + 0xffffffffffff) === Date Sun Jan 01 10941 06:31:50 GMT+0100 (Central European Standard Time)

function longToByteArray(long: number) {
  const byteArray = new Uint8Array([0, 0, 0, 0, 0, 0]);
  const bytes = byteArray.length - 1;
  for (let index = 0; index < byteArray.length; index++) {
    const byte = long & 0xff;
    byteArray[bytes - index] = byte;
    long = (long - byte) / 256;
  }
  return byteArray;
}

// function byteArrayToLong(byteArray: number[]): number {
//   var value = 0
//   for (var i = byteArray.length - 1; i >= 0; i--) {
//     value = value * 256 + byteArray[i]
//   }
//   return value
// }

let lastSuidTime = 0;

export function suidBytes(): Uint8Array {
  let ms = Date.now() - ReferenceDateInMS;
  // Ensure monotonic increase for sortability
  if (ms <= lastSuidTime) {
    ms = lastSuidTime + 1;
  }
  lastSuidTime = ms;
  return new Uint8Array([...longToByteArray(ms), ...randomUint8Array(10)]);
}

/**
 * 현재 시간을 기준으로 정렬 가능한 유니크 ID를 생성합니다.
 *
 * @returns 정렬 가능한 Base62 형식의 유니크 ID입니다.
 */
export function suid(): string {
  return uuidEncode(suidBytes());
}

/**
 * 정렬 가능한 유니크 ID의 생성 시간을 반환합니다.
 *
 * @param id - 정렬 가능한 ID (Base62 형식).
 * @returns ID가 생성된 시간의 Date 객체입니다.
 */
export function suidDate(id: string): Date {
  return suidBytesDate(uuidDecode(id));
}

export function suidBytesDate(id: Uint8Array): Date {
  return new Date(ReferenceDateInMS + id.slice(0, 6).reduce((acc, byte) => acc * 256 + byte, 0));
}

// 32 bit UUID

export function uuid32bit(): number {
  return new Uint32Array(randomUint8Array(4))[0];
}

// Global Settings

const mapModes = {
  base62: {
    uuid: uuidB62,
    uuidDecode: uuidDecodeB62,
    uuidEncode: uuidB62,
  },
  base32: {
    uuid: uuidB32,
    uuidDecode: uuidDecodeB32,
    uuidEncode: uuidB32,
  },
  uuidv4: {
    uuid: uuidv4,
    uuidDecode: uuidDecodeV4,
    uuidEncode: uuidEncodeV4,
  },
};

let _mode: keyof typeof mapModes = 'base62';
let _sorted = false;

export function setUuidDefaultEncoding(mode?: keyof typeof mapModes, sorted = false) {
  _mode = mode ?? 'base62';
  _sorted = sorted;
}

export function uuid(): string {
  return mapModes[_mode].uuid(_sorted ? suidBytes() : uuidBytes());
}

export function uuidDecode(uuid: string): Uint8Array {
  return mapModes[_mode].uuidDecode(uuid);
}

export function uuidEncode(bytes: Uint8Array): string {
  return mapModes[_mode].uuidEncode(bytes);
}

/**
 * UUID의 유효성을 검증합니다.
 * 다양한 포맷(Base62, Base32, UUIDv4)을 자동으로 감지하여 검증합니다.
 *
 * @param uuid - 검증할 UUID 문자열입니다.
 * @returns UUID가 유효한 경우 `true`, 그렇지 않은 경우 `false`를 반환합니다.
 */
export function uuidIsValid(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') {
    return false;
  }

  // UUIDv4 format check (36 characters with hyphens)
  if (uuid.length === 36 && uuid.indexOf('-') !== -1) {
    try {
      const bin = uuidDecodeV4(uuid);
      return bin.length === uuidBytesLength;
    } catch (err) {
      // continue to try other formats
    }
  }

  // Base62 format check (typically 22 characters)
  if (uuid.length === 22) {
    try {
      const bin = uuidDecodeB62(uuid);
      return bin.length === uuidBytesLength;
    } catch (err) {
      // continue to try other formats
    }
  }

  // Base32 format check (typically 26 characters)
  if (uuid.length === 26) {
    try {
      const bin = uuidDecodeB32(uuid);
      return bin.length === uuidBytesLength;
    } catch (err) {
      // continue to try other formats
    }
  }

  return false;
}

// Simple Counters

const _unameCounters: Record<string, number> = {};

export function uname(name = 'id'): string {
  if (_unameCounters[name] == null) _unameCounters[name] = 0;

  return `${name}-${_unameCounters[name]++}`;
}

export function unameReset(name = 'id') {
  _unameCounters[name] = 0;
}

let _qid = 0;

export function qid(): string {
  return `id-${_qid++}`;
}
