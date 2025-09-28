export function convertDataURLToBlob(dataUrl: string): Blob {
  // Data URL에서 MIME 타입과 base64 데이터를 분리
  const [header, base64Data] = dataUrl.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : '';

  // base64 데이터를 디코딩
  const byteString = atob(base64Data);
  const byteArray = new Uint8Array(byteString.length);

  // 디코딩된 데이터를 바이트 배열로 변환
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  // Blob 객체 생성
  return new Blob([byteArray], { type: mimeType });
}
