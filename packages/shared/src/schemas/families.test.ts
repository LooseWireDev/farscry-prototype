import { describe, it, expect } from 'vitest';
import { familyRoleSchema, createFamilyInputSchema, inviteFamilyInputSchema } from './families';

describe('familyRoleSchema', () => {
  it('accepts admin and member roles', () => {
    expect(familyRoleSchema.safeParse('admin').success).toBe(true);
    expect(familyRoleSchema.safeParse('member').success).toBe(true);
  });

  it('rejects invalid roles', () => {
    expect(familyRoleSchema.safeParse('owner').success).toBe(false);
    expect(familyRoleSchema.safeParse('moderator').success).toBe(false);
    expect(familyRoleSchema.safeParse('').success).toBe(false);
  });
});

describe('createFamilyInputSchema', () => {
  it('accepts a valid family name', () => {
    expect(createFamilyInputSchema.safeParse({ name: 'The Smiths' }).success).toBe(true);
  });

  it('rejects an empty family name', () => {
    expect(createFamilyInputSchema.safeParse({ name: '' }).success).toBe(false);
  });

  it('rejects a family name longer than 50 characters', () => {
    expect(createFamilyInputSchema.safeParse({ name: 'a'.repeat(51) }).success).toBe(false);
    expect(createFamilyInputSchema.safeParse({ name: 'a'.repeat(50) }).success).toBe(true);
  });

  it('rejects missing name', () => {
    expect(createFamilyInputSchema.safeParse({}).success).toBe(false);
  });
});

describe('inviteFamilyInputSchema', () => {
  it('accepts a valid UUID for familyId', () => {
    expect(
      inviteFamilyInputSchema.safeParse({
        familyId: '550e8400-e29b-41d4-a716-446655440000',
      }).success,
    ).toBe(true);
  });

  it('rejects non-UUID strings', () => {
    expect(inviteFamilyInputSchema.safeParse({ familyId: 'not-a-uuid' }).success).toBe(false);
  });
});
