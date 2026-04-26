import { describe, it, expect } from 'vitest';
import { subscriptionTierSchema, subscriptionStatusSchema } from './subscriptions';

describe('subscriptionTierSchema', () => {
  it('accepts personal and family tiers', () => {
    expect(subscriptionTierSchema.safeParse('personal').success).toBe(true);
    expect(subscriptionTierSchema.safeParse('family').success).toBe(true);
  });

  it('rejects invalid tiers', () => {
    expect(subscriptionTierSchema.safeParse('enterprise').success).toBe(false);
    expect(subscriptionTierSchema.safeParse('free').success).toBe(false);
    expect(subscriptionTierSchema.safeParse('').success).toBe(false);
  });
});

describe('subscriptionStatusSchema', () => {
  it('accepts all valid statuses', () => {
    const validStatuses = ['active', 'past_due', 'canceled', 'expired'];
    for (const status of validStatuses) {
      expect(subscriptionStatusSchema.safeParse(status).success).toBe(true);
    }
  });

  it('rejects invalid statuses', () => {
    const invalidStatuses = ['pending', 'trial', 'paused', ''];
    for (const status of invalidStatuses) {
      expect(subscriptionStatusSchema.safeParse(status).success).toBe(false);
    }
  });
});
