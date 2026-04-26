import { router, publicProcedure } from './trpcInit';
import { usersRouter } from './features/users/router';
import { contactsRouter } from './features/contacts/router';
import { callsRouter } from './features/calls/router';
import { subscriptionsRouter } from './features/subscriptions/router';
import { familiesRouter } from './features/families/router';

export { createContext } from './trpcInit';

export const appRouter = router({
  health: publicProcedure.query((): { status: string } => {
    return { status: 'ok' };
  }),
  users: usersRouter,
  contacts: contactsRouter,
  calls: callsRouter,
  subscriptions: subscriptionsRouter,
  families: familiesRouter,
});

export type AppRouter = typeof appRouter;
