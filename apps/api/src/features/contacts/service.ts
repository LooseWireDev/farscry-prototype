import { eq, and, or, like } from 'drizzle-orm';
import { db } from '../../auth/auth';
import { user, contacts } from '../../db/schema';

export interface ContactResult {
  id: string;
  username: string | null;
  displayId: string | null;
  avatarUrl: string | null;
}

export interface ContactListItem {
  contactId: string;
  nickname: string | null;
  username: string | null;
  displayId: string | null;
  avatarUrl: string | null;
  addedAt: Date;
}

export async function searchUsers(query: string, requesterId: string): Promise<ContactResult[]> {
  const isDisplayIdSearch = query.includes('#');

  const results = await db
    .select({
      id: user.id,
      username: user.username,
      displayId: user.displayId,
      avatarUrl: user.avatarUrl,
    })
    .from(user)
    .where(
      isDisplayIdSearch
        ? eq(user.displayId, query)
        : like(user.username, `${query}%`),
    )
    .limit(20);

  return results.filter((r) => r.id !== requesterId);
}

export async function listContacts(ownerId: string): Promise<ContactListItem[]> {
  const results = await db
    .select({
      contactId: contacts.contactId,
      nickname: contacts.nickname,
      username: user.username,
      displayId: user.displayId,
      avatarUrl: user.avatarUrl,
      addedAt: contacts.createdAt,
    })
    .from(contacts)
    .innerJoin(user, eq(contacts.contactId, user.id))
    .where(eq(contacts.ownerId, ownerId));

  return results;
}

export async function addContact(ownerId: string, contactId: string): Promise<{ id: string }> {
  const result = await db
    .insert(contacts)
    .values({
      ownerId,
      contactId,
      createdAt: new Date(),
    })
    .returning({ id: contacts.id });

  return result[0]!;
}

export async function removeContact(ownerId: string, contactId: string): Promise<void> {
  await db
    .delete(contacts)
    .where(and(eq(contacts.ownerId, ownerId), eq(contacts.contactId, contactId)));
}

export async function updateContactNickname(
  ownerId: string,
  contactId: string,
  nickname: string | null,
): Promise<void> {
  await db
    .update(contacts)
    .set({ nickname })
    .where(and(eq(contacts.ownerId, ownerId), eq(contacts.contactId, contactId)));
}
