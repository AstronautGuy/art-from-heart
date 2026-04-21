"use client";

import { useState } from "react";
import { Navbar } from "@/app/_components/storefront/Navbar";
import { ProductGrid } from "@/app/_components/storefront/ProductGrid";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";

export default function ShopDirectory() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const { data: categories } = api.public.getCategories.useQuery();
  const { data: products, isLoading } = api.public.getStorefrontProducts.useQuery({
    categoryId: activeCategoryId || undefined
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-24 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">Entire Collection</h1>
            <p className="mt-2 text-slate-500">Browse our complete catalogue of handcrafted items.</p>
          </div>

          {/* Filtering Pills Top-Row */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategoryId(null)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategoryId === null 
                  ? "bg-slate-900 text-white" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              All
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategoryId === cat.id 
                    ? "bg-slate-900 text-white" 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Core */}
        {isLoading ? (
          <div className="flex justify-center py-32">
             <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
          </div>
        ) : (
          <ProductGrid products={products || []} />
        )}
      </main>
    </div>
  );
}
