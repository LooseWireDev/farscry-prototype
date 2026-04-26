import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { displayCodeSchema, displayIdSchema } from '@project/shared/schemas';
import { generateDisplayCode, computeDisplayId } from './service';

describe('generateDisplayCode', () => {
  it('returns a 6-character lowercase hex string', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const code = generateDisplayCode();
        expect(code).toMatch(/^[a-f0-9]{6}$/);
      }),
      { numRuns: 50 },
    );
  });

  it('passes displayCodeSchema validation', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const code = generateDisplayCode();
        expect(displayCodeSchema.safeParse(code).success).toBe(true);
      }),
      { numRuns: 50 },
    );
  });

  it('produces different codes on successive calls', () => {
    const codes = new Set(Array.from({ length: 100 }, () => generateDisplayCode()));
    // With 16^6 = 16M possibilities, 100 calls should produce at least 90 unique codes
    expect(codes.size).toBeGreaterThan(90);
  });
});

describe('computeDisplayId', () => {
  it('combines username and displayCode with # separator', () => {
    expect(computeDisplayId('gavin', 'a3f2c1')).toBe('gavin#a3f2c1');
  });

  it('passes displayIdSchema validation for valid inputs', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-z0-9][a-z0-9-]{1,8}[a-z0-9]$/),
        fc.stringMatching(/^[a-f0-9]{6}$/),
        (username, code) => {
          const displayId = computeDisplayId(username, code);
          expect(displayIdSchema.safeParse(displayId).success).toBe(true);
        },
      ),
    );
  });

  it('always produces a string in the format username#code', () => {
    const result = computeDisplayId('my-user', 'abcdef');
    expect(result).toBe('my-user#abcdef');
  });
});
