import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  unique,
  check,
  index,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ─── Better Auth Core Tables ────────────────────────────────────────────────

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  username: text('username').unique(),
  displayCode: text('display_code'),
  displayId: text('display_id').unique(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  expiresAt: timestamp('expires_at'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

// ─── Application Tables ─────────────────────────────────────────────────────

export const families = pgTable('families', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdById: text('created_by_id')
    .notNull()
    .references(() => user.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const familyMembers = pgTable(
  'family_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    familyId: uuid('family_id')
      .notNull()
      .references(() => families.id),
    userId: text('user_id')
      .notNull()
      .references(() => user.id)
      .unique(),
    role: text('role', { enum: ['admin', 'member'] }).notNull(),
    joinedAt: timestamp('joined_at').notNull().defaultNow(),
  },
  (table) => [
    unique('family_members_family_user_unique').on(table.familyId, table.userId),
    index('family_members_family_id_idx').on(table.familyId),
  ],
);

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    tier: text('tier', { enum: ['personal', 'family'] }).notNull(),
    status: text('status', { enum: ['active', 'past_due', 'canceled', 'expired'] }).notNull(),
    polarCustomerId: text('polar_customer_id'),
    polarSubscriptionId: text('polar_subscription_id'),
    currentPeriodEnd: timestamp('current_period_end'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [index('subscriptions_user_id_idx').on(table.userId)],
);

export const contacts = pgTable(
  'contacts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: text('owner_id')
      .notNull()
      .references(() => user.id),
    contactId: text('contact_id')
      .notNull()
      .references(() => user.id),
    nickname: text('nickname'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    unique('contacts_owner_contact_unique').on(table.ownerId, table.contactId),
    index('contacts_owner_id_idx').on(table.ownerId),
    check('contacts_no_self_add', sql`${table.ownerId} != ${table.contactId}`),
  ],
);

export const calls = pgTable(
  'calls',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    callerId: text('caller_id')
      .notNull()
      .references(() => user.id),
    calleeId: text('callee_id')
      .notNull()
      .references(() => user.id),
    status: text('status', {
      enum: ['ringing', 'answered', 'missed', 'declined', 'ended'],
    }).notNull(),
    startedAt: timestamp('started_at').notNull().defaultNow(),
    answeredAt: timestamp('answered_at'),
    endedAt: timestamp('ended_at'),
    duration: integer('duration'),
  },
  (table) => [
    index('calls_caller_id_idx').on(table.callerId),
    index('calls_callee_id_idx').on(table.calleeId),
  ],
);
