export function isSvgDataURL(dataUrl: string): boolean {
  // SVG는 image/svg+xml MIME 타입을 사용하며, 다양한 형태가 가능
  // data:image/svg+xml,<svg>...</svg>
  // data:image/svg+xml;base64,<base64-encoded-svg>
  // data:image/svg+xml;charset=utf-8,<svg>...</svg>
  const svgRegex = /^data:image\/svg\+xml(?:;[^,]*)?,/;
  return svgRegex.test(dataUrl);
}
