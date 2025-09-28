const characterMap: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(source: string) {
  return source.replace(/[&<>"']/g, (s: string) => {
    const c = characterMap[s];
    return typeof c === 'string' ? c : '';
  });
}
