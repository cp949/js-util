export function replaceAll(org: string, target: string, replacement: string): string {
  return org.split(target).join(replacement);
}
