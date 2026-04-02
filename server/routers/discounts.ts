import { publicProcedure, router } from '../_core/trpc';
import { z } from 'zod';

export const discountsRouter = router({
  validateCode: publicProcedure
    .input(
      z.object({
        code: z.string().min(1),
        orderAmount: z.number().min(0),
      })
    )
    .query(async ({ input }) => {
      // TODO: Replace with actual database query
      // For now, return mock validation
      const validCodes: Record<string, { discountType: 'percentage' | 'fixed'; discountValue: number; minOrderAmount: number }> = {
        'WELCOME10': { discountType: 'percentage', discountValue: 10, minOrderAmount: 0 },
        'SAVE20': { discountType: 'percentage', discountValue: 20, minOrderAmount: 5000 },
        'FLAT50': { discountType: 'fixed', discountValue: 5000, minOrderAmount: 10000 },
      };

      const discount = validCodes[input.code.toUpperCase()];

      if (!discount) {
        return {
          valid: false,
          error: 'Invalid discount code',
        };
      }

      if (input.orderAmount < discount.minOrderAmount) {
        return {
          valid: false,
          error: `Minimum order amount of ${discount.minOrderAmount / 100} is required`,
        };
      }

      const discountAmount =
        discount.discountType === 'percentage'
          ? Math.round(input.orderAmount * (discount.discountValue / 100))
          : discount.discountValue;

      return {
        valid: true,
        discountType: discount.discountType,
        discountValue: discount.discountValue,
        discountAmount,
      };
    }),
});
