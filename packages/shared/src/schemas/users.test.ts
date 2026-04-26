import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  usernameSchema,
  displayCodeSchema,
  displayIdSchema,
  setUsernameInputSchema,
  updateProfileInputSchema,
} from './users';

describe('usernameSchema', () => {
  it('accepts valid lowercase alphanumeric usernames', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-z0-9][a-z0-9-]{1,18}[a-z0-9]$/),
        (username) => {
          expect(usernameSchema.safeParse(username).success).toBe(true);
        },
      ),
    );
  });

  it('accepts single-character usernames (min length 3)', () => {
    expect(usernameSchema.safeParse('a').success).toBe(false);
    expect(usernameSchema.safeParse('ab').success).toBe(false);
    expect(usernameSchema.safeParse('abc').success).toBe(true);
  });

  it('rejects usernames longer than 20 characters', () => {
    expect(usernameSchema.safeParse('a'.repeat(21)).success).toBe(false);
    expect(usernameSchema.safeParse('a'.repeat(20)).success).toBe(true);
  });

  it('rejects usernames with uppercase letters', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[A-Z][a-z0-9]{2,19}$/),
        (username) => {
          expect(usernameSchema.safeParse(username).success).toBe(false);
        },
      ),
    );
  });

  it('rejects usernames starting or ending with a hyphen', () => {
    expect(usernameSchema.safeParse('-abc').success).toBe(false);
    expect(usernameSchema.safeParse('abc-').success).toBe(false);
    expect(usernameSchema.safeParse('-abc-').success).toBe(false);
  });

  it('accepts usernames with hyphens in the middle', () => {
    expect(usernameSchema.safeParse('a-b').success).toBe(true);
    expect(usernameSchema.safeParse('my-user').success).toBe(true);
    expect(usernameSchema.safeParse('a-b-c').success).toBe(true);
  });

  it('rejects usernames with special characters', () => {
    const specialChars = ['user@name', 'user.name', 'user name', 'user_name', 'user!name'];
    for (const name of specialChars) {
      expect(usernameSchema.safeParse(name).success).toBe(false);
    }
  });
});

describe('displayCodeSchema', () => {
  it('accepts valid 6-character hex codes', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-f0-9]{6}$/),
        (code) => {
          expect(displayCodeSchema.safeParse(code).success).toBe(true);
        },
      ),
    );
  });

  it('rejects codes that are not exactly 6 characters', () => {
    expect(displayCodeSchema.safeParse('a3f2c').success).toBe(false);
    expect(displayCodeSchema.safeParse('a3f2c1f').success).toBe(false);
    expect(displayCodeSchema.safeParse('').success).toBe(false);
  });

  it('rejects codes with uppercase hex', () => {
    expect(displayCodeSchema.safeParse('A3F2C1').success).toBe(false);
    expect(displayCodeSchema.safeParse('a3F2c1').success).toBe(false);
  });

  it('rejects codes with non-hex characters', () => {
    expect(displayCodeSchema.safeParse('g3f2c1').success).toBe(false);
    expect(displayCodeSchema.safeParse('zzzzzz').success).toBe(false);
  });
});

describe('displayIdSchema', () => {
  it('accepts valid displayIds in username#hexcode format', () => {
    expect(displayIdSchema.safeParse('gavin#a3f2c1').success).toBe(true);
    expect(displayIdSchema.safeParse('a#000000').success).toBe(true);
    expect(displayIdSchema.safeParse('my-user#abcdef').success).toBe(true);
  });

  it('rejects displayIds without the # separator', () => {
    expect(displayIdSchema.safeParse('gavina3f2c1').success).toBe(false);
  });

  it('rejects displayIds with invalid username portion', () => {
    expect(displayIdSchema.safeParse('-gavin#a3f2c1').success).toBe(false);
    expect(displayIdSchema.safeParse('Gavin#a3f2c1').success).toBe(false);
  });

  it('rejects displayIds with invalid hex code portion', () => {
    expect(displayIdSchema.safeParse('gavin#AABBCC').success).toBe(false);
    expect(displayIdSchema.safeParse('gavin#abc').success).toBe(false);
    expect(displayIdSchema.safeParse('gavin#abcdefg').success).toBe(false);
  });
});

describe('setUsernameInputSchema', () => {
  it('accepts valid input with a username', () => {
    expect(setUsernameInputSchema.safeParse({ username: 'gavin' }).success).toBe(true);
  });

  it('rejects input without a username', () => {
    expect(setUsernameInputSchema.safeParse({}).success).toBe(false);
  });

  it('rejects input with an invalid username', () => {
    expect(setUsernameInputSchema.safeParse({ username: '-bad' }).success).toBe(false);
  });
});

describe('updateProfileInputSchema', () => {
  it('accepts empty object (no updates)', () => {
    expect(updateProfileInputSchema.safeParse({}).success).toBe(true);
  });

  it('accepts a valid avatar URL', () => {
    expect(
      updateProfileInputSchema.safeParse({ avatarUrl: 'https://example.com/avatar.png' }).success,
    ).toBe(true);
  });

  it('accepts null avatar URL (clearing avatar)', () => {
    expect(updateProfileInputSchema.safeParse({ avatarUrl: null }).success).toBe(true);
  });

  it('rejects invalid avatar URL', () => {
    expect(updateProfileInputSchema.safeParse({ avatarUrl: 'not-a-url' }).success).toBe(false);
  });
});
