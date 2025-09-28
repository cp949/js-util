/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
declare var setImmediate: any;

const delayCallback: Function = (() => {
  if (typeof requestAnimationFrame !== 'undefined') {
    return requestAnimationFrame;
  } else if (typeof setImmediate !== 'undefined') {
    return setImmediate;
  }
  return (f: Function) => f(); // no delays
})();

function nextFrame(): Promise<void> {
  return new Promise<void>((resolve) => delayCallback(() => resolve()));
}

export { nextFrame };
