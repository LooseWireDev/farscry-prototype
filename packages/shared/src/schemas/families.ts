import { z } from 'zod';

export const familyRoleSchema = z.enum(['admin', 'member']);

export const createFamilyInputSchema = z.object({
  name: z.string().min(1).max(50),
});

export const inviteFamilyInputSchema = z.object({
  familyId: z.string().uuid(),
});

export type FamilyRole = z.infer<typeof familyRoleSchema>;
export type CreateFamilyInput = z.infer<typeof createFamilyInputSchema>;
export type InviteFamilyInput = z.infer<typeof inviteFamilyInputSchema>;
