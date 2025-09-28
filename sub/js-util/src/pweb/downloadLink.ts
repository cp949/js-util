export function downloadLink(href: string) {
  if ('download' in HTMLAnchorElement.prototype) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = href;
    a.type = 'application/octet-stream';
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
}
