// copy and convert to typescript by jjfive
// https://github.com/pillarjs/encodeurl/blob/master/index.js

/**
 * encodeurl
 * TypeScript Version
 *
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Regular expression to match non-URL code points, *after* encoding (i.e. not including "%")
 * and including invalid escape sequences.
 */
const ENCODE_CHARS_REGEXP =
  /(?:[^\x21\x23-\x3B\x3D\x3F-\x5F\x61-\x7A\x7C\x7E]|%(?:[^0-9A-Fa-f]|[0-9A-Fa-f][^0-9A-Fa-f]|$))+/g;

/**
 * Regular expression to match unmatched surrogate pair.
 */
const UNMATCHED_SURROGATE_PAIR_REGEXP =
  /(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]|[\uD800-\uDBFF]([^\uDC00-\uDFFF]|$)/g;

/**
 * String to replace unmatched surrogate pair with.
 */
const UNMATCHED_SURROGATE_PAIR_REPLACE = '$1\uFFFD$2';

/**
 * Encode a URL to a percent-encoded form, excluding already-encoded sequences.
 *
 * This function will take an already-encoded URL and encode all the non-URL
 * code points. This function will not encode the "%" character unless it is
 * not part of a valid sequence (`%20` will be left as-is, but `%foo` will
 * be encoded as `%25foo`).
 *
 * This encode is meant to be "safe" and does not throw errors. It will try as
 * hard as it can to properly encode the given URL, including replacing any raw,
 * unpaired surrogate pairs with the Unicode replacement character prior to
 * encoding.
 *
 * @param url - The URL string to encode.
 * @returns The encoded URL.
 * 
 * @example
 encodeUrl('http://[::1]:8080/foo/bar') => 'http://[::1]:8080/foo/bar'
 encodeUrl('http:\\\\localhost\\foo\\bar.html') => 'http:\\\\localhost\\foo\\bar.html'
encodeUrl('http://localhost/\nsnow.html') => 'http://localhost/%0Asnow.html'
encodeUrl('http://localhost/\fsnow.html') => 'http://localhost/%0Csnow.html'
encodeUrl('/\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f') => '/%00%01%02%03%04%05%06%07%08%09%0A%0B%0C%0D%0E%0F'
encodeUrl('/\x60\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f') => '/%60abcdefghijklmno'
encodeUrl('http://localhost/%F0snow.html') => 'http://localhost/%F0snow.html'
encodeUrl('http://localhost/%foo%bar%zap%') => 'http://localhost/%25foo%bar%25zap%25'
encodeUrl('http://localhost/\uD83D\uDC7B snow.html') => 'http://localhost/%F0%9F%91%BB%20snow.html'
encodeUrl('http://localhost/\uD83Dfoo\uDC7B <\uDC7B\uD83D>.html') => 'http://localhost/%EF%BF%BDfoo%EF%BF%BD%20%3C%EF%BF%BD%EF%BF%BD%3E.html'
*/
export function encodeUrl(url: string): string {
  return String(url)
    .replace(UNMATCHED_SURROGATE_PAIR_REGEXP, UNMATCHED_SURROGATE_PAIR_REPLACE)
    .replace(ENCODE_CHARS_REGEXP, encodeURI);
}

/*
This function is similar to the intrinsic function encodeURI. However, it will not encode:

- The \, ^, or | characters
- The % character when it's part of a valid sequence
- [ and ] (for IPv6 hostnames)
- Replaces raw, unpaired surrogate pairs with the Unicode replacement character

As a result, the encoding aligns closely with the behavior in the WHATWG URL specification. 
However, this package only encodes strings and does not do any URL parsing or formatting.

It is expected that any output from new URL(url) will not change when used with this package, as the output has already been encoded. 
Additionally, if we were to encode before new URL(url), we do not expect the before and after encoded formats to be parsed any differently.
*/
