import { describe, it, expect } from 'vitest';
import {
  addContactInputSchema,
  searchContactsInputSchema,
  updateContactInputSchema,
} from './contacts';

describe('addContactInputSchema', () => {
  it('accepts a valid better-auth user ID', () => {
    expect(
      addContactInputSchema.safeParse({
        contactId: 'yEoDZj2Bt20Z3sMmmGaEO7TyPcLaq3bC',
      }).success,
    ).toBe(true);
  });

  it('rejects empty string', () => {
    expect(addContactInputSchema.safeParse({ contactId: '' }).success).toBe(false);
  });

  it('rejects missing contactId', () => {
    expect(addContactInputSchema.safeParse({}).success).toBe(false);
  });
});

describe('searchContactsInputSchema', () => {
  it('accepts a valid search query', () => {
    expect(searchContactsInputSchema.safeParse({ query: 'gavin' }).success).toBe(true);
    expect(searchContactsInputSchema.safeParse({ query: 'gavin#a3f2c1' }).success).toBe(true);
  });

  it('rejects an empty query', () => {
    expect(searchContactsInputSchema.safeParse({ query: '' }).success).toBe(false);
  });

  it('rejects a query longer than 50 characters', () => {
    expect(searchContactsInputSchema.safeParse({ query: 'a'.repeat(51) }).success).toBe(false);
    expect(searchContactsInputSchema.safeParse({ query: 'a'.repeat(50) }).success).toBe(true);
  });
});

describe('updateContactInputSchema', () => {
  it('accepts a valid contactId with a nickname', () => {
    expect(
      updateContactInputSchema.safeParse({
        contactId: 'yEoDZj2Bt20Z3sMmmGaEO7TyPcLaq3bC',
        nickname: 'Mom',
      }).success,
    ).toBe(true);
  });

  it('accepts null nickname (clearing nickname)', () => {
    expect(
      updateContactInputSchema.safeParse({
        contactId: 'yEoDZj2Bt20Z3sMmmGaEO7TyPcLaq3bC',
        nickname: null,
      }).success,
    ).toBe(true);
  });

  it('rejects empty nickname string', () => {
    expect(
      updateContactInputSchema.safeParse({
        contactId: 'yEoDZj2Bt20Z3sMmmGaEO7TyPcLaq3bC',
        nickname: '',
      }).success,
    ).toBe(false);
  });

  it('rejects nickname longer than 50 characters', () => {
    expect(
      updateContactInputSchema.safeParse({
        contactId: 'yEoDZj2Bt20Z3sMmmGaEO7TyPcLaq3bC',
        nickname: 'a'.repeat(51),
      }).success,
    ).toBe(false);
  });
});
