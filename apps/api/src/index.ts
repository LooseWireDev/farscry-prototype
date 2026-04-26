import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter, createContext } from './trpc';
import { authRoutes } from './auth/authRoutes';
import { errorHandler } from './middleware/errorHandler';
import { wsApp, injectWebSocket } from './features/realtime/websocket';
import { paymentsRoutes } from './features/payments/router';

const app = new Hono();

app.onError(errorHandler);

app.use('*', cors({
  origin: (origin) => origin?.startsWith('http://localhost:') ? origin : null,
  allowHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Mount auth routes
app.route('/api/auth', authRoutes);

// Mount payment webhooks
app.route('/api/payments', paymentsRoutes);

// Mount WebSocket
app.route('/', wsApp);

// Mount tRPC
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext,
  }),
);

const port = Number(process.env.PORT) || 3000;

const server = serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server running at http://localhost:${info.port}`);
});

injectWebSocket(server);

export default app;
