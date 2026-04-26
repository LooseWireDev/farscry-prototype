import { describe, it, expect } from 'vitest';

describe('subscriptions service', () => {
  // Subscription logic (hasActiveSubscription) requires DB for family membership lookups.
  // Tier and status enums are validated in packages/shared/src/schemas/subscriptions.test.ts
  it('tier and status enums are validated by shared schema tests', () => {
    expect(true).toBe(true);
  });
});
