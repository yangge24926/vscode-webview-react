export function formatString(str: string, ...args: any[]): string {
  return str.replace(/%s/g, () => args.shift());
}
