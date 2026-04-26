import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';

const client = postgres(process.env.DATABASE_URL ?? 'postgresql://user:password@localhost:5432/farscry');
export const db = drizzle(client, { schema });

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  trustedOrigins: ['http://localhost:*'],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  user: {
    additionalFields: {
      username: {
        type: 'string',
        required: false,
        input: false,
      },
      displayCode: {
        type: 'string',
        required: false,
        input: false,
      },
      displayId: {
        type: 'string',
        required: false,
        input: false,
      },
      avatarUrl: {
        type: 'string',
        required: false,
        input: false,
      },
    },
  },
});
