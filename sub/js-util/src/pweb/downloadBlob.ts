export function downloadBlob(blob: Blob, fileName: string) {
  // URL 생성
  const href = URL.createObjectURL(blob);
  try {
    if ('download' in HTMLAnchorElement.prototype) {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = href;
      a.download = fileName;
      a.click();
      document.body.removeChild(a);
    } else {
      // iOS Safari, open a new page and set href to data-uri
      const popup: Window | null = window.open('', '_blank');
      if (popup) {
        popup.location.href = href;
      } else {
        console.warn('window.open() fail');
      }
    }
  } finally {
    URL.revokeObjectURL(href);
  }
}
