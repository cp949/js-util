export function isImageDataURL(dataUrl: string, checkSvg = false): boolean {
  if (checkSvg) {
    const imageRegex = /^data:image\/(png|jpeg|gif|bmp|webp|svg\+xml);base64,/;

    // 일반 이미지나 SVG 여부 확인
    return imageRegex.test(dataUrl);
  }

  const imageRegex = /^data:image\/(png|jpeg|gif|bmp|webp);base64,/;
  return imageRegex.test(dataUrl);
}
