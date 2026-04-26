import { router, protectedProcedure } from '../../trpcInit';
import { eq, or, desc } from 'drizzle-orm';
import { db } from '../../auth/auth';
import { calls, user } from '../../db/schema';

export const callsRouter = router({
  history: protectedProcedure.query(async ({ ctx }) => {
    const results = await db
      .select({
        id: calls.id,
        callerId: calls.callerId,
        calleeId: calls.calleeId,
        status: calls.status,
        startedAt: calls.startedAt,
        answeredAt: calls.answeredAt,
        endedAt: calls.endedAt,
        duration: calls.duration,
      })
      .from(calls)
      .where(or(eq(calls.callerId, ctx.userId), eq(calls.calleeId, ctx.userId)))
      .orderBy(desc(calls.startedAt))
      .limit(50);

    return results;
  }),
});
