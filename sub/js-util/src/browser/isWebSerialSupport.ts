export function isWebSerialSupport(): boolean {
  try {
    if (typeof window === 'undefined' || !window || !window.navigator) {
      return false;
    }
    
    return 'serial' in window.navigator;
  } catch {
    return false;
  }
}
