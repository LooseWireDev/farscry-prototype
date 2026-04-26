import { eq, and } from 'drizzle-orm';
import { db } from '../../auth/auth';
import { families, familyMembers } from '../../db/schema';
import { generateInviteCode } from './inviteCode';

export { generateInviteCode };

// In-memory invite code store. In production, use a table or Redis.
const inviteCodes = new Map<string, { familyId: string; expiresAt: Date }>();

export async function createFamily(
  userId: string,
  name: string,
): Promise<{ id: string }> {
  const existing = await db
    .select({ id: familyMembers.id })
    .from(familyMembers)
    .where(eq(familyMembers.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    throw new Error('User already belongs to a family');
  }

  const now = new Date();
  const result = await db
    .insert(families)
    .values({ name, createdById: userId, createdAt: now, updatedAt: now })
    .returning({ id: families.id });

  const familyId = result[0]!.id;

  await db.insert(familyMembers).values({
    familyId,
    userId,
    role: 'admin',
    joinedAt: now,
  });

  return { id: familyId };
}

export async function getFamily(familyId: string): Promise<{
  id: string;
  name: string;
  members: { userId: string; role: string; joinedAt: Date }[];
} | null> {
  const family = await db
    .select({ id: families.id, name: families.name })
    .from(families)
    .where(eq(families.id, familyId))
    .limit(1);

  if (family.length === 0) return null;

  const members = await db
    .select({
      userId: familyMembers.userId,
      role: familyMembers.role,
      joinedAt: familyMembers.joinedAt,
    })
    .from(familyMembers)
    .where(eq(familyMembers.familyId, familyId));

  return { ...family[0]!, members };
}

export async function getUserFamily(userId: string): Promise<string | null> {
  const result = await db
    .select({ familyId: familyMembers.familyId })
    .from(familyMembers)
    .where(eq(familyMembers.userId, userId))
    .limit(1);

  return result[0]?.familyId ?? null;
}

export function createInvite(familyId: string): string {
  const code = generateInviteCode();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  inviteCodes.set(code, { familyId, expiresAt });
  return code;
}

export async function joinFamily(userId: string, inviteCode: string): Promise<{ familyId: string }> {
  const invite = inviteCodes.get(inviteCode);
  if (!invite || invite.expiresAt < new Date()) {
    throw new Error('Invalid or expired invite code');
  }

  const existing = await db
    .select({ id: familyMembers.id })
    .from(familyMembers)
    .where(eq(familyMembers.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    throw new Error('User already belongs to a family');
  }

  await db.insert(familyMembers).values({
    familyId: invite.familyId,
    userId,
    role: 'member',
    joinedAt: new Date(),
  });

  inviteCodes.delete(inviteCode);

  return { familyId: invite.familyId };
}

export async function leaveFamily(userId: string): Promise<void> {
  const membership = await db
    .select({ id: familyMembers.id, role: familyMembers.role, familyId: familyMembers.familyId })
    .from(familyMembers)
    .where(eq(familyMembers.userId, userId))
    .limit(1);

  if (membership.length === 0) {
    throw new Error('User is not in a family');
  }

  if (membership[0]!.role === 'admin') {
    throw new Error('Admin cannot leave the family. Transfer ownership or delete the family.');
  }

  await db.delete(familyMembers).where(eq(familyMembers.id, membership[0]!.id));
}

export async function removeMember(adminId: string, targetUserId: string): Promise<void> {
  const adminMembership = await db
    .select({ familyId: familyMembers.familyId, role: familyMembers.role })
    .from(familyMembers)
    .where(eq(familyMembers.userId, adminId))
    .limit(1);

  if (adminMembership.length === 0 || adminMembership[0]!.role !== 'admin') {
    throw new Error('Only admins can remove members');
  }

  await db
    .delete(familyMembers)
    .where(
      and(
        eq(familyMembers.familyId, adminMembership[0]!.familyId),
        eq(familyMembers.userId, targetUserId),
      ),
    );
}
