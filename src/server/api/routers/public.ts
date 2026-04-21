import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { products } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";

export const publicRouter = createTRPCRouter({
  getStorefrontProducts: publicProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.products.findMany({
        where: input.categoryId
          ? eq(products.categoryId, input.categoryId)
          : undefined,
        orderBy: [desc(products.createdAt)],
        with: { category: true },
      });
    }),

  getProductById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.query.products.findFirst({
        where: eq(products.id, input.id),
        with: { category: true },
      });
      return product ?? null;
    }),

  getFeaturedProducts: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.products.findMany({
      where: eq(products.featured, true),
      orderBy: [desc(products.createdAt)],
      with: { category: true },
    });
  }),

  getCategories: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });
  }),
});
