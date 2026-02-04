export const toCamel = (text: string) => {
  return text.toLowerCase().replace(/^./, c => c.toUpperCase());
}

export const enumToText = (enumObj: Object, value: string | number): string => {
  const label = typeof value === 'number' ? (enumObj as any)[value] : value;
  if (!label) return '';
  return String(label).toLowerCase();
};

export function makeCssSafe(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-') // Replace invalid chars with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}