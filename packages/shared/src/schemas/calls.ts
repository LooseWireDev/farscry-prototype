import { z } from 'zod';

export const callStatusSchema = z.enum(['ringing', 'answered', 'missed', 'declined', 'ended']);

export const initiateCallInputSchema = z.object({
  calleeId: z.string().min(1).max(64),
});

export type CallStatus = z.infer<typeof callStatusSchema>;
export type InitiateCallInput = z.infer<typeof initiateCallInputSchema>;
