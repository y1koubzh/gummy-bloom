import { protectedProcedure, router } from '../_core/trpc';
import { getCartItems, addToCart, updateCartItem, deleteCartItem, getProductBySlug } from '../db';
import { z } from 'zod';

export const cartRouter = router({
  getItems: protectedProcedure.query(async ({ ctx }) => {
    return await getCartItems(ctx.user.id);
  }),

  addItem: protectedProcedure
    .input(
      z.object({
        productId: z.number().optional(),
        customFormulaId: z.number().optional(),
        quantity: z.number().min(1),
        price: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.productId && !input.customFormulaId) {
        throw new Error('Either productId or customFormulaId is required');
      }

      return await addToCart({
        userId: ctx.user.id,
        productId: input.productId,
        customFormulaId: input.customFormulaId,
        quantity: input.quantity,
        price: input.price,
      });
    }),

  updateItem: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ input }) => {
      return await updateCartItem(input.id, input.quantity);
    }),

  removeItem: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await deleteCartItem(input.id);
    }),

  clear: protectedProcedure.mutation(async ({ ctx }) => {
    const items = await getCartItems(ctx.user.id);
    for (const item of items) {
      await deleteCartItem(item.id);
    }
    return { success: true };
  }),
});
