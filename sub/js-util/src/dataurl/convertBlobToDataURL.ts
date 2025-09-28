/**
 * 주어진 BLOB 객체를 dataURL로 변환합니다.
 * @param blob - BLOB 객체
 * @returns dataURL
 */
export function convertBlobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error('Failed to convert Blob to dataURL'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading Blob'));
    reader.readAsDataURL(blob);
  });
}
