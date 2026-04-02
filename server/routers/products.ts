import { publicProcedure, router } from '../_core/trpc';
import { getProducts, getProductBySlug, getCategories, getProductReviews } from '../db';
import { z } from 'zod';

export const productsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().default(12),
        offset: z.number().default(0),
        categoryId: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const products = await getProducts(input.limit, input.offset, input.categoryId);
      return products;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const product = await getProductBySlug(input.slug);
      if (!product) {
        throw new Error('Product not found');
      }
      const reviews = await getProductReviews(product.id);
      return { ...product, reviews };
    }),

  categories: publicProcedure.query(async () => {
    return await getCategories();
  }),

  reviews: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      return await getProductReviews(input.productId);
    }),
});
