import { router, protectedProcedure } from '../../trpcInit';
import { getSubscription, hasActiveSubscription } from './service';

export const subscriptionsRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    return getSubscription(ctx.userId);
  }),

  status: protectedProcedure.query(async ({ ctx }): Promise<{ active: boolean }> => {
    const active = await hasActiveSubscription(ctx.userId);
    return { active };
  }),
});
