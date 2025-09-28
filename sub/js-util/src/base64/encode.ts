/* eslint-disable no-var */
declare var Buffer: any;

const runningOnBrowser = typeof window !== 'undefined';

export function encode(data: string) {
  if (runningOnBrowser) {
    return btoa(data);
  }
  // btoa polyfill for Node
  return Buffer.from(data).toString('base64');
}
