import { Navbar } from "@/app/_components/storefront/Navbar";
import { Hero3D } from "@/app/_components/storefront/Hero3D";
import { ProductGrid } from "@/app/_components/storefront/ProductGrid";
import { api } from "@/trpc/server";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const featuredProducts = await api.public.getFeaturedProducts();

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Navbar />
      
      <main>
        {/* HERO SECTION */}
        <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          <Hero3D />
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-6 drop-shadow-sm">
              Art From Heart.
            </h1>
            <p className="text-lg md:text-xl text-slate-700 mb-10 max-w-2xl font-medium drop-shadow-sm">
              Handcrafted resin arts, exclusive stationery, and custom pieces designed to elevate your everyday aesthetics.
            </p>
            <Link 
              href="/shop" 
              className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-slate-900 rounded-full hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5"
            >
              Explore Collection
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* FEATURED SET SECTION */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Featured Releases</h2>
                <p className="mt-2 text-slate-500">Curated pieces available for a limited time.</p>
              </div>
              <Link href="/shop" className="hidden sm:flex items-center text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors">
                View everything <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <ProductGrid products={featuredProducts} />

            <div className="mt-12 flex justify-center sm:hidden">
              <Link href="/shop" className="flex items-center text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors">
                View everything <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
