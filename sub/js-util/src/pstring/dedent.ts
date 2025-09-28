export function dedent(content: string): string {
  if (content.length === 0) {
    return content;
  }

  const lines = content.split(/[\r\n]+/);
  if (lines.length === 1) {
    return lines[0].trim();
  }

  for (const line of lines) {
    // skip initial empty lines
    if (line.trim().length > 0) {
      const match = line.match(/^(\s+)/);
      if (match) {
        const indent = match[1];
        return content.replace(new RegExp('^' + indent, 'gm'), '');
      }
      return content;
    }
  }
  return content;
}
