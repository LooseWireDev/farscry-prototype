import { router, protectedProcedure } from '../../trpcInit';
import { TRPCError } from '@trpc/server';
import {
  searchContactsInputSchema,
  addContactInputSchema,
  updateContactInputSchema,
} from '@project/shared/schemas';
import { z } from 'zod';
import { searchUsers, listContacts, addContact, removeContact, updateContactNickname } from './service';

export const contactsRouter = router({
  search: protectedProcedure
    .input(searchContactsInputSchema)
    .query(async ({ ctx, input }) => {
      return searchUsers(input.query, ctx.userId);
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return listContacts(ctx.userId);
  }),

  add: protectedProcedure
    .input(addContactInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.contactId === ctx.userId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot add yourself as a contact' });
      }

      return addContact(ctx.userId, input.contactId);
    }),

  remove: protectedProcedure
    .input(z.object({ contactId: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }): Promise<{ success: boolean }> => {
      await removeContact(ctx.userId, input.contactId);
      return { success: true };
    }),

  updateNickname: protectedProcedure
    .input(updateContactInputSchema)
    .mutation(async ({ ctx, input }): Promise<{ success: boolean }> => {
      await updateContactNickname(ctx.userId, input.contactId, input.nickname);
      return { success: true };
    }),
});
