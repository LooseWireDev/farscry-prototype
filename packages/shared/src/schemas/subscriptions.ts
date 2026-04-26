import { z } from 'zod';

export const subscriptionTierSchema = z.enum(['personal', 'family']);

export const subscriptionStatusSchema = z.enum(['active', 'past_due', 'canceled', 'expired']);

export type SubscriptionTier = z.infer<typeof subscriptionTierSchema>;
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;
