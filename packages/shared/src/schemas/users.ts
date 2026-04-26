import { z } from 'zod';

export const usernameSchema = z
  .string()
  .min(3)
  .max(20)
  .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/, 'Must be lowercase alphanumeric with hyphens, cannot start or end with a hyphen');

export const displayCodeSchema = z
  .string()
  .length(6)
  .regex(/^[a-f0-9]{6}$/, 'Must be a 6-character hex code');

export const displayIdSchema = z
  .string()
  .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]#[a-f0-9]{6}$|^[a-z0-9]#[a-f0-9]{6}$/, 'Must be username#hexcode format');

export const setUsernameInputSchema = z.object({
  username: usernameSchema,
});

export const updateProfileInputSchema = z.object({
  avatarUrl: z.string().url().nullable().optional(),
});

export type Username = z.infer<typeof usernameSchema>;
export type DisplayCode = z.infer<typeof displayCodeSchema>;
export type DisplayId = z.infer<typeof displayIdSchema>;
export type SetUsernameInput = z.infer<typeof setUsernameInputSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;
