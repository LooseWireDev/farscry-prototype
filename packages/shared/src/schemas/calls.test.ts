import { describe, it, expect } from 'vitest';
import { callStatusSchema, initiateCallInputSchema } from './calls';

describe('callStatusSchema', () => {
  it('accepts all valid call statuses', () => {
    const validStatuses = ['ringing', 'answered', 'missed', 'declined', 'ended'];
    for (const status of validStatuses) {
      expect(callStatusSchema.safeParse(status).success).toBe(true);
    }
  });

  it('rejects invalid statuses', () => {
    const invalidStatuses = ['connecting', 'busy', 'failed', 'active', ''];
    for (const status of invalidStatuses) {
      expect(callStatusSchema.safeParse(status).success).toBe(false);
    }
  });
});

describe('initiateCallInputSchema', () => {
  it('accepts a valid better-auth user ID', () => {
    expect(
      initiateCallInputSchema.safeParse({
        calleeId: 'yEoDZj2Bt20Z3sMmmGaEO7TyPcLaq3bC',
      }).success,
    ).toBe(true);
  });

  it('rejects empty calleeId', () => {
    expect(initiateCallInputSchema.safeParse({ calleeId: '' }).success).toBe(false);
  });

  it('rejects missing calleeId', () => {
    expect(initiateCallInputSchema.safeParse({}).success).toBe(false);
  });
});
