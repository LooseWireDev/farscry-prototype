import { Hono } from 'hono';
import { upsertSubscription } from '../subscriptions/service';
import { webhookEventSchema } from './types';
import { eq } from 'drizzle-orm';
import { db } from '../../auth/auth';
import { user } from '../../db/schema';

export const paymentsRoutes = new Hono();

paymentsRoutes.post('/webhooks/polar', async (c) => {
  const body = await c.req.json();
  const parsed = webhookEventSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: 'Invalid webhook payload' }, 400);
  }

  const event = parsed.data;

  // Polar sends subscription events with type like "subscription.created", "subscription.updated"
  if (typeof event.type === 'string' && event.type.startsWith('subscription.')) {
    const data = event.data as {
      customer_id?: string;
      id?: string;
      status?: string;
      current_period_end?: string;
      metadata?: { user_id?: string; tier?: string };
    };

    const userId = data.metadata?.user_id;
    const tier = (data.metadata?.tier ?? 'personal') as 'personal' | 'family';

    if (!userId) {
      return c.json({ error: 'Missing user_id in metadata' }, 400);
    }

    const statusMap: Record<string, 'active' | 'past_due' | 'canceled' | 'expired'> = {
      active: 'active',
      past_due: 'past_due',
      canceled: 'canceled',
      expired: 'expired',
      incomplete_expired: 'expired',
    };

    const status = statusMap[data.status ?? ''] ?? 'active';

    await upsertSubscription(userId, {
      tier,
      status,
      polarCustomerId: data.customer_id ?? '',
      polarSubscriptionId: data.id ?? '',
      currentPeriodEnd: data.current_period_end ? new Date(data.current_period_end) : null,
    });
  }

  return c.json({ received: true });
});
