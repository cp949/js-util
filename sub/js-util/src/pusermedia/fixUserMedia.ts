// 유틸에서 도메인을 참조하지 않으므로 여기서 정의한다
const BROWER_NOT_SUPPORT = 'Browser not support';

export function fixUserMedia() {
  if (typeof window === 'undefined') {
    return;
  }

  window.AudioContext = window.AudioContext || (window as any)['webkitAudioContext'];

  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    const navigatorAny = navigator as any;
    navigatorAny.mediaDevices = {};
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    //@ts-ignore
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // First get ahold of the legacy getUserMedia, if present
      const getUserMedia =
        (navigator as any)['getUserMedia'] ||
        (navigator as any)['webkitGetUserMedia'] ||
        (navigator as any)['mozGetUserMedia'] ||
        (navigator as any)['msGetUserMedia'];

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(new Error(BROWER_NOT_SUPPORT));
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
}
fixUserMedia();
