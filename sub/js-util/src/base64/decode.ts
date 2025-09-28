/* eslint-disable no-var */
declare var Buffer: any;

const runningOnBrowser = typeof window !== 'undefined';

export function decode(data: string) {
  if (runningOnBrowser) {
    return atob(data);
  }
  // atob polyfill for Node
  return Buffer.from(data, 'base64').toString('binary');
}
