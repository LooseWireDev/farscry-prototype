import { randomBytes } from 'node:crypto';

export function generateDisplayCode(): string {
  return randomBytes(3).toString('hex');
}

export function computeDisplayId(username: string, displayCode: string): string {
  return `${username}#${displayCode}`;
}
