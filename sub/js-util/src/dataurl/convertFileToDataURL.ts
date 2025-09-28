/**
 * 주어진 파일 객체를 dataURL로 변환합니다.
 * @param file - 파일 객체
 * @returns dataURL
 */
export function convertFileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error('Failed to convert File to dataURL'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading File'));
    reader.readAsDataURL(file);
  });
}
