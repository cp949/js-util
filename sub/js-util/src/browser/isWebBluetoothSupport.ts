export function isWebBluetoothSupport(): boolean {
  try {
    if (typeof window === 'undefined' || !window || !window.navigator) {
      return false;
    }

    return 'bluetooth' in window.navigator;
  } catch {
    return false;
  }
}
