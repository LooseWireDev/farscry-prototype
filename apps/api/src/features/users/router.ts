import { router, protectedProcedure } from '../../trpcInit';
import { setUsernameInputSchema, updateProfileInputSchema } from '@project/shared/schemas';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { db } from '../../auth/auth';
import { user } from '../../db/schema';
import { generateDisplayCode, computeDisplayId } from './service';

export const usersRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }): Promise<{
    id: string;
    email: string;
    username: string | null;
    displayId: string | null;
    avatarUrl: string | null;
  }> => {
    const result = await db
      .select({
        id: user.id,
        email: user.email,
        username: user.username,
        displayId: user.displayId,
        avatarUrl: user.avatarUrl,
      })
      .from(user)
      .where(eq(user.id, ctx.userId))
      .limit(1);

    if (result.length === 0) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }

    return result[0]!;
  }),

  setUsername: protectedProcedure
    .input(setUsernameInputSchema)
    .mutation(async ({ ctx, input }): Promise<{ displayId: string }> => {
      const existing = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.username, input.username))
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Username already taken' });
      }

      const currentUser = await db
        .select({ username: user.username })
        .from(user)
        .where(eq(user.id, ctx.userId))
        .limit(1);

      if (currentUser[0]?.username) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Username already set' });
      }

      const displayCode = generateDisplayCode();
      const displayId = computeDisplayId(input.username, displayCode);

      await db
        .update(user)
        .set({
          username: input.username,
          displayCode,
          displayId,
          updatedAt: new Date(),
        })
        .where(eq(user.id, ctx.userId));

      return { displayId };
    }),

  updateProfile: protectedProcedure
    .input(updateProfileInputSchema)
    .mutation(async ({ ctx, input }): Promise<{ success: boolean }> => {
      const updates: Record<string, unknown> = { updatedAt: new Date() };

      if (input.avatarUrl !== undefined) {
        updates.avatarUrl = input.avatarUrl;
      }

      await db.update(user).set(updates).where(eq(user.id, ctx.userId));

      return { success: true };
    }),
});
