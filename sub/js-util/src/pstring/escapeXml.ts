const characterMap: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&apos;',
};

export function escapeXml(source: string): string {
  return source.replace(/[&<>"']/g, (s: string) => {
    const c = characterMap[s];
    return typeof c === 'string' ? c : '';
  });
}
