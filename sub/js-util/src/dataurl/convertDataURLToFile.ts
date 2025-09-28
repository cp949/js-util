import { convertDataURLToBlob } from './convertDataURLToBlob.js';

export function convertDataURLToFile(
  dataUrl: string,
  filename: string | ((mimeType: string) => string),
): File {
  const blob = convertDataURLToBlob(dataUrl);

  const fname = typeof filename === 'string' ? filename : filename(blob.type);
  return new File([blob], fname, { type: blob.type });
}
