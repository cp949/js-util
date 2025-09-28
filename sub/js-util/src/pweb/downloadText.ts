import { downloadBlob } from './downloadBlob.js';

export function downloadText(text: string, fileName: string) {
  downloadBlob(new Blob([text], { type: 'text/plain' }), fileName);
}
