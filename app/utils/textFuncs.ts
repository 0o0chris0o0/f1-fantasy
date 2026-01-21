import { iCardRarity } from "~/types/card";

export const toCamel = (text: string) => {
  return text.toLowerCase().replace(/^./, c => c.toUpperCase());
}

export const enumToText = (enumObj: Object, value: string | number): string => {
  const label = typeof value === 'number' ? (enumObj as any)[value] : value;
  if (!label) return '';
  return String(label).toLowerCase();
};