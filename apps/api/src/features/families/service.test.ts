import { describe, it, expect } from 'vitest';
import { generateInviteCode } from './inviteCode';

describe('generateInviteCode', () => {
  it('returns an 8-character hex string', () => {
    const code = generateInviteCode();
    expect(code).toMatch(/^[a-f0-9]{8}$/);
    expect(code).toHaveLength(8);
  });

  it('produces unique codes', () => {
    const codes = new Set(Array.from({ length: 50 }, () => generateInviteCode()));
    expect(codes.size).toBeGreaterThan(45);
  });
});
