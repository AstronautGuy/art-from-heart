import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTableCreator,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Multi-project schema feature of Drizzle ORM.
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `art-from-heart_${name}`);

export const categories = createTable(
  "category",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).unique().notNull(),
    featured: boolean("featured").default(false).notNull(),
    order: integer("order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (t) => [index("category_slug_idx").on(t.slug)],
);

export const products = createTable(
  "product",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    categoryId: varchar("category_id", { length: 128 }),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    price: integer("price").notNull(),
    images: jsonb("images").$type<string[]>().default([]).notNull(),
    tags: jsonb("tags").$type<string[]>().default([]).notNull(),
    stockType: varchar("stock_type", { length: 50 }).notNull(), // 'limited', 'made_to_order'
    stockQuantity: integer("stock_quantity").default(0).notNull(),
    freeShippingEligible: boolean("free_shipping_eligible")
      .default(false)
      .notNull(),
    featured: boolean("featured").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (t) => [
    index("product_category_idx").on(t.categoryId),
    index("product_active_idx").on(t.isActive),
  ],
);

export const storeSettings = createTable("store_setting", {
  id: varchar("id", { length: 128 }).primaryKey(),
  config: jsonb("config").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

// Define relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));
