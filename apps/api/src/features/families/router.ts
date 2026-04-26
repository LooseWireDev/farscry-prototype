import { router, protectedProcedure } from '../../trpcInit';
import { TRPCError } from '@trpc/server';
import { createFamilyInputSchema } from '@project/shared/schemas';
import { z } from 'zod';
import {
  createFamily,
  getFamily,
  getUserFamily,
  createInvite,
  joinFamily,
  leaveFamily,
  removeMember,
} from './service';

export const familiesRouter = router({
  create: protectedProcedure
    .input(createFamilyInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await createFamily(ctx.userId, input.name);
      } catch (e) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: e instanceof Error ? e.message : 'Failed to create family',
        });
      }
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const familyId = await getUserFamily(ctx.userId);
    if (!familyId) return null;
    return getFamily(familyId);
  }),

  invite: protectedProcedure.mutation(async ({ ctx }): Promise<{ code: string }> => {
    const familyId = await getUserFamily(ctx.userId);
    if (!familyId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'You are not in a family' });
    }
    const code = createInvite(familyId);
    return { code };
  }),

  join: protectedProcedure
    .input(z.object({ inviteCode: z.string().length(8) }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await joinFamily(ctx.userId, input.inviteCode);
      } catch (e) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: e instanceof Error ? e.message : 'Failed to join family',
        });
      }
    }),

  leave: protectedProcedure.mutation(async ({ ctx }): Promise<{ success: boolean }> => {
    try {
      await leaveFamily(ctx.userId);
      return { success: true };
    } catch (e) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: e instanceof Error ? e.message : 'Failed to leave family',
      });
    }
  }),

  removeMember: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }): Promise<{ success: boolean }> => {
      try {
        await removeMember(ctx.userId, input.userId);
        return { success: true };
      } catch (e) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: e instanceof Error ? e.message : 'Failed to remove member',
        });
      }
    }),
});
