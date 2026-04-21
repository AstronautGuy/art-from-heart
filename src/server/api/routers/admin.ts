import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { categories, products, storeSettings } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { getPresignedUploadUrl } from "@/server/r2";

export const adminRouter = createTRPCRouter({
  // --- Categories ---
  getCategories: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });
  }),

  createCategory: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(categories).values({
        id: createId(),
        name: input.name,
        slug: input.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
        featured: input.featured,
      });
    }),

  deleteCategory: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // NOTE: Should handle cascading deletes manually if foreign keys constraints aren't set
      await ctx.db.delete(categories).where(eq(categories.id, input.id));
    }),

  // --- Products ---
  getProducts: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.products.findMany({
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      with: { category: true },
    });
  }),

  createProduct: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().int().positive(),
        images: z.array(z.string()).default([]),
        categoryId: z.string(),
        stockType: z.enum(["limited", "made_to_order"]),
        stockQuantity: z.number().int().default(0),
        freeShippingEligible: z.boolean().default(false),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(products).values({
        id: createId(),
        name: input.name,
        categoryId: input.categoryId,
        description: input.description,
        price: input.price, // Stored in cents / paise
        images: input.images,
        stockType: input.stockType,
        stockQuantity: input.stockQuantity,
        freeShippingEligible: input.freeShippingEligible,
        featured: input.featured,
      });
    }),

  updateProduct: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().int().positive(),
        images: z.array(z.string()).default([]),
        categoryId: z.string(),
        stockType: z.enum(["limited", "made_to_order"]),
        stockQuantity: z.number().int().default(0),
        freeShippingEligible: z.boolean().default(false),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(products)
        .set({
          name: input.name,
          categoryId: input.categoryId,
          description: input.description,
          price: input.price,
          images: input.images,
          stockType: input.stockType,
          stockQuantity: input.stockQuantity,
          freeShippingEligible: input.freeShippingEligible,
          featured: input.featured,
        })
        .where(eq(products.id, input.id));
    }),

  deleteProduct: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(products).where(eq(products.id, input.id));
    }),

  // --- Settings ---
  getSettings: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.storeSettings.findFirst();
  }),

  upsertSettings: adminProcedure
    .input(
      z.object({
        config: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.storeSettings.findFirst();
      if (existing) {
        await ctx.db.update(storeSettings)
          .set({ config: input.config })
          .where(eq(storeSettings.id, existing.id));
      } else {
        await ctx.db.insert(storeSettings).values({
          id: createId(),
          config: input.config,
        });
      }
    }),

  // --- Utility ---
  createPresignedUrl: adminProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const uniqueName = `${Date.now()}-${input.filename.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
      return getPresignedUploadUrl(uniqueName, input.contentType);
    }),
});
