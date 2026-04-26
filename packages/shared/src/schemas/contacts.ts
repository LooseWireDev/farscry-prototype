import { z } from 'zod';

// User IDs are issued by better-auth (random strings, not UUIDs).
const userIdSchema = z.string().min(1).max(64);

export const addContactInputSchema = z.object({
  contactId: userIdSchema,
});

export const searchContactsInputSchema = z.object({
  query: z.string().min(1).max(50),
});

export const updateContactInputSchema = z.object({
  contactId: userIdSchema,
  nickname: z.string().min(1).max(50).nullable(),
});

export type AddContactInput = z.infer<typeof addContactInputSchema>;
export type SearchContactsInput = z.infer<typeof searchContactsInputSchema>;
export type UpdateContactInput = z.infer<typeof updateContactInputSchema>;
