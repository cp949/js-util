export function isTouchDevice(): boolean {
  try {
    if (typeof window === 'undefined' || !window || !window.navigator) {
      return false;
    }

    return !!(
      'ontouchstart' in window ||
      (window.navigator.maxTouchPoints && window.navigator.maxTouchPoints > 0)
    );
  } catch {
    return false;
  }
}
