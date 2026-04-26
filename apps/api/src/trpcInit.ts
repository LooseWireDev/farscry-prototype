import { initTRPC, TRPCError } from '@trpc/server';
import { auth } from './auth/auth';

export interface Context {
  req: Request;
  userId: string | null;
}

export async function createContext({ req }: { req: Request }): Promise<Context> {
  const session = await auth.api.getSession({ headers: req.headers });
  return {
    req,
    userId: session?.user?.id ?? null,
  };
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});
