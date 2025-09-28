type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

const objectToString = Object.prototype.toString;
const uint8ArrayStringified = '[object Uint8Array]';

export function isUint8Array(value: unknown): value is Uint8Array {
  if (!value) {
    return false;
  }

  if (value.constructor === Uint8Array) {
    return true;
  }

  return objectToString.call(value) === uint8ArrayStringified;
}

/**
Throw a `TypeError` if the given value is not an instance of `Uint8Array`.

@example
```
import {assertUint8Array} from 'uint8array-extras';

try {
	assertUint8Array(new ArrayBuffer(10)); // Throws a TypeError
} catch (error) {
	console.error(error.message);
}
```
*/
export function assertUint8Array(value: unknown) {
  if (!isUint8Array(value)) {
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof value}\``);
  }
}

/**
Convert a value to a `Uint8Array` without copying its data.

This can be useful for converting a `Buffer` to a pure `Uint8Array`. `Buffer` is already an `Uint8Array` subclass, but [`Buffer` alters some behavior](https://sindresorhus.com/blog/goodbye-nodejs-buffer), so it can be useful to cast it to a pure `Uint8Array` before returning it.

Tip: If you want a copy, just call `.slice()` on the return value.
*/
export function toUint8Array(value: TypedArray | ArrayBuffer | DataView): Uint8Array {
  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }

  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }

  throw new TypeError(`Unsupported value, got \`${typeof value}\`.`);
}

/**
Concatenate the given arrays into a new array.

If `arrays` is empty, it will return a zero-sized `Uint8Array`.

If `totalLength` is not specified, it is calculated from summing the lengths of the given arrays.

Replacement for [`Buffer.concat()`](https://nodejs.org/api/buffer.html#static-method-bufferconcatlist-totallength).

@example
```
import {concatUint8Arrays} from 'uint8array-extras';

const a = new Uint8Array([1, 2, 3]);
const b = new Uint8Array([4, 5, 6]);

console.log(concatUint8Arrays([a, b]));
//=> Uint8Array [1, 2, 3, 4, 5, 6]
```
*/
export function concatUint8Arrays(arrays: Uint8Array[], totalLength?: number): Uint8Array {
  if (arrays.length === 0) {
    return new Uint8Array(0);
  }

  totalLength ??= arrays.reduce(
    (accumulator, currentValue) => accumulator + currentValue.length,
    0,
  );

  const returnValue = new Uint8Array(totalLength);

  let offset = 0;
  for (const array of arrays) {
    assertUint8Array(array);
    returnValue.set(array, offset);
    offset += array.length;
  }

  return returnValue;
}

/**
Check if two arrays are identical by verifying that they contain the same bytes in the same sequence.

Replacement for [`Buffer#equals()`](https://nodejs.org/api/buffer.html#bufequalsotherbuffer).

@example
```
import {areUint8ArraysEqual} from 'uint8array-extras';

const a = new Uint8Array([1, 2, 3]);
const b = new Uint8Array([1, 2, 3]);
const c = new Uint8Array([4, 5, 6]);

console.log(areUint8ArraysEqual(a, b));
//=> true

console.log(areUint8ArraysEqual(a, c));
//=> false
```
*/
export function areUint8ArraysEqual(a: Uint8Array, b: Uint8Array): boolean {
  assertUint8Array(a);
  assertUint8Array(b);

  if (a === b) {
    return true;
  }

  if (a.length !== b.length) {
    return false;
  }

  for (let index = 0; index < a.length; index++) {
    if (a[index] !== b[index]) {
      return false;
    }
  }

  return true;
}

/**
Compare two arrays and indicate their relative order or equality. Useful for sorting.

Replacement for [`Buffer.compare()`](https://nodejs.org/api/buffer.html#static-method-buffercomparebuf1-buf2).

@example
```
import {compareUint8Arrays} from 'uint8array-extras';

const array1 = new Uint8Array([1, 2, 3]);
const array2 = new Uint8Array([4, 5, 6]);
const array3 = new Uint8Array([7, 8, 9]);

[array3, array1, array2].sort(compareUint8Arrays);
//=> [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
```
*/
export function compareUint8Arrays(a: Uint8Array, b: Uint8Array): 0 | 1 | -1 {
  assertUint8Array(a);
  assertUint8Array(b);

  const length = Math.min(a.length, b.length);

  for (let index = 0; index < length; index++) {
    const diff = a[index] - b[index];
    if (diff !== 0) {
      return Math.sign(diff) as 0 | 1 | -1;
    }
  }

  // At this point, all the compared elements are equal.
  // The shorter array should come first if the arrays are of different lengths.
  return Math.sign(a.length - b.length) as 0 | 1 | -1;
}

const cachedDecoders: Record<string, TextDecoder> = {
  utf8: new TextDecoder('utf8'),
};

/**
Convert a `Uint8Array` to a string.

@param encoding - The [encoding](https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings) to convert from. Default: `'utf8'`

Replacement for [`Buffer#toString()`](https://nodejs.org/api/buffer.html#buftostringencoding-start-end). For the `encoding` parameter, `latin1` should be used instead of `binary` and `utf-16le` instead of `utf16le`.

@example
```
import {uint8ArrayToString} from 'uint8array-extras';

const byteArray = new Uint8Array([72, 101, 108, 108, 111]);
console.log(uint8ArrayToString(byteArray));
//=> 'Hello'

const zh = new Uint8Array([167, 65, 166, 110]);
console.log(uint8ArrayToString(zh, 'big5'));
//=> '你好'

const ja = new Uint8Array([130, 177, 130, 241, 130, 201, 130, 191, 130, 205]);
console.log(uint8ArrayToString(ja, 'shift-jis'));
//=> 'こんにちは'
```
*/
export function uint8ArrayToString(array: Uint8Array, encoding = 'utf8'): string {
  assertUint8Array(array);
  cachedDecoders[encoding] ??= new TextDecoder(encoding);
  return cachedDecoders[encoding].decode(array);
}

function assertString(value: unknown) {
  if (typeof value !== 'string') {
    throw new TypeError(`Expected \`string\`, got \`${typeof value}\``);
  }
}

const cachedEncoder = new TextEncoder();

export function stringToUint8Array(string: string): Uint8Array {
  assertString(string);
  return cachedEncoder.encode(string);
}

function base64ToBase64Url(base64: string) {
  return base64.replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function base64UrlToBase64(base64url: string): string {
  return base64url.replaceAll('-', '+').replaceAll('_', '/');
}

// Reference: https://phuoc.ng/collection/this-vs-that/concat-vs-push/
const MAX_BLOCK_SIZE = 65535;

export function uint8ArrayToBase64(array: Uint8Array, { urlSafe = false } = {}) {
  assertUint8Array(array);

  let base64;

  if (array.length < MAX_BLOCK_SIZE) {
    // Required as `btoa` and `atob` don't properly support Unicode: https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
    base64 = btoa(String.fromCodePoint.apply('', array as unknown as number[]));
  } else {
    base64 = '';
    for (const value of array) {
      base64 += String.fromCodePoint(value);
    }

    base64 = btoa(base64);
  }

  return urlSafe ? base64ToBase64Url(base64) : base64;
}

export function base64ToUint8Array(base64String: string): Uint8Array {
  assertString(base64String);
  return Uint8Array.from(atob(base64UrlToBase64(base64String)), (x) => x.codePointAt(0) as number);
}

export function stringToBase64(str: string, { urlSafe = false } = {}): string {
  assertString(str);
  return uint8ArrayToBase64(stringToUint8Array(str), { urlSafe });
}

export function base64ToString(base64String: string): string {
  assertString(base64String);
  return uint8ArrayToString(base64ToUint8Array(base64String));
}

const byteToHexLookupTable = Array.from({ length: 256 }, (_, index) =>
  index.toString(16).padStart(2, '0'),
);

export function uint8ArrayToHex(array: Uint8Array): string {
  assertUint8Array(array);

  // Concatenating a string is faster than using an array.
  let hexString = '';

  for (let index = 0; index < array.length; index++) {
    hexString += byteToHexLookupTable[array[index]];
  }

  return hexString;
}

const hexToDecimalLookupTable = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  b: 11,
  c: 12,
  d: 13,
  e: 14,
  f: 15,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
} as const;

export function hexToUint8Array(hexString: string) {
  assertString(hexString);

  if (hexString.length % 2 !== 0) {
    throw new Error('Invalid Hex string length.');
  }

  const resultLength = hexString.length / 2;
  const bytes = new Uint8Array(resultLength);

  for (let index = 0; index < resultLength; index++) {
    const highNibble = (hexToDecimalLookupTable as any)[hexString[index * 2]];
    const lowNibble = (hexToDecimalLookupTable as any)[hexString[index * 2 + 1]];

    if (highNibble === undefined || lowNibble === undefined) {
      throw new Error(`Invalid Hex character encountered at position ${index * 2}`);
    }

    bytes[index] = (highNibble << 4) | lowNibble;
  }

  return bytes;
}

/**
 * Read DataView#byteLength number of bytes from the given view, up to 48-bit.
 * Replacement for Buffer#readUintBE
 * @param {DataView} view
 * @returns {number}
 * @example
 * const byteArray = new Uint8Array([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);
 * console.log(getUintBE(new DataView(byteArray.buffer)));
 * //=> 20015998341291
 */
export function getUintBE(view: DataView) {
  const { byteLength } = view;

  if (byteLength === 6) {
    return view.getUint16(0) * 2 ** 32 + view.getUint32(2);
  }

  if (byteLength === 5) {
    return view.getUint8(0) * 2 ** 32 + view.getUint32(1);
  }

  if (byteLength === 4) {
    return view.getUint32(0);
  }

  if (byteLength === 3) {
    return view.getUint8(0) * 2 ** 16 + view.getUint16(1);
  }

  if (byteLength === 2) {
    return view.getUint16(0);
  }

  if (byteLength === 1) {
    return view.getUint8(0);
  }
  throw new Error(`DataView byteLength invalid: byteLength=${byteLength}`);
}

/**
@param {Uint8Array} array
@param {Uint8Array} value
@returns {number}
*/
export function indexOf(array: Uint8Array, value: Uint8Array): number {
  const arrayLength = array.length;
  const valueLength = value.length;

  if (valueLength === 0) {
    return -1;
  }

  if (valueLength > arrayLength) {
    return -1;
  }

  const validOffsetLength = arrayLength - valueLength;

  for (let index = 0; index <= validOffsetLength; index++) {
    let isMatch = true;
    for (let index2 = 0; index2 < valueLength; index2++) {
      if (array[index + index2] !== value[index2]) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      return index;
    }
  }

  return -1;
}

/**
@param array
@param value
@returns
*/
/**
Checks if the given sequence of bytes (`value`) is within the given `Uint8Array` (`array`).

Returns true if the value is included, otherwise false.

Replacement for [`Buffer#includes`](https://nodejs.org/api/buffer.html#bufincludesvalue-byteoffset-encoding). `Uint8Array#includes` only takes a number which is different from Buffer's `includes` implementation.

```
import {includes} from 'uint8array-extras';

const byteArray = new Uint8Array([0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef]);

console.log(includes(byteArray, new Uint8Array([0x78, 0x90])));
//=> true
```
*/
export function includes(array: Uint8Array, value: Uint8Array): boolean {
  return indexOf(array, value) !== -1;
}
