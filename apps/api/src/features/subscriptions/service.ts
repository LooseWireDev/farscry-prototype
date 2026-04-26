import { eq, and } from 'drizzle-orm';
import { db } from '../../auth/auth';
import { subscriptions, familyMembers } from '../../db/schema';

export interface SubscriptionInfo {
  id: string;
  tier: string;
  status: string;
  currentPeriodEnd: Date | null;
}

export async function getSubscription(userId: string): Promise<SubscriptionInfo | null> {
  const result = await db
    .select({
      id: subscriptions.id,
      tier: subscriptions.tier,
      status: subscriptions.status,
      currentPeriodEnd: subscriptions.currentPeriodEnd,
    })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  return result[0] ?? null;
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  // Check own subscription
  const own = await getSubscription(userId);
  if (own && own.status === 'active') return true;

  // Check if user is in a family whose admin has a family subscription
  const membership = await db
    .select({ familyId: familyMembers.familyId })
    .from(familyMembers)
    .where(eq(familyMembers.userId, userId))
    .limit(1);

  if (membership.length === 0) return false;

  const familyId = membership[0]!.familyId;

  // Find the admin of the family
  const admin = await db
    .select({ userId: familyMembers.userId })
    .from(familyMembers)
    .where(and(eq(familyMembers.familyId, familyId), eq(familyMembers.role, 'admin')))
    .limit(1);

  if (admin.length === 0) return false;

  // Check if the admin has an active family subscription
  const adminSub = await db
    .select({ tier: subscriptions.tier, status: subscriptions.status })
    .from(subscriptions)
    .where(eq(subscriptions.userId, admin[0]!.userId))
    .limit(1);

  return adminSub.length > 0 && adminSub[0]!.status === 'active' && adminSub[0]!.tier === 'family';
}

export async function upsertSubscription(
  userId: string,
  data: {
    tier: 'personal' | 'family';
    status: 'active' | 'past_due' | 'canceled' | 'expired';
    polarCustomerId: string;
    polarSubscriptionId: string;
    currentPeriodEnd: Date | null;
  },
): Promise<void> {
  const existing = await getSubscription(userId);

  if (existing) {
    await db
      .update(subscriptions)
      .set({
        tier: data.tier,
        status: data.status,
        polarCustomerId: data.polarCustomerId,
        polarSubscriptionId: data.polarSubscriptionId,
        currentPeriodEnd: data.currentPeriodEnd,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, existing.id));
  } else {
    await db.insert(subscriptions).values({
      userId,
      tier: data.tier,
      status: data.status,
      polarCustomerId: data.polarCustomerId,
      polarSubscriptionId: data.polarSubscriptionId,
      currentPeriodEnd: data.currentPeriodEnd,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
