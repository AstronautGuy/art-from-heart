"use client";

import { use } from "react";
import { Navbar } from "@/app/_components/storefront/Navbar";
import { api } from "@/trpc/react";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useCartStore } from "@/store/useCartStore";

gsap.registerPlugin(ScrollTrigger);

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: product, isLoading } = api.public.getProductById.useQuery({ id: resolvedParams.id });
  const detailRef = useRef<HTMLDivElement>(null);
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "center" });
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
      stockType: product.stockType,
      stockQuantity: product.stockQuantity,
    });
  };

  useEffect(() => {
    if (!detailRef.current || !product) return;
    
    // Slight parallax on details panel
    gsap.to(detailRef.current, {
      y: 50,
      ease: "none",
      scrollTrigger: {
        trigger: detailRef.current,
        start: "top center",
        end: "bottom top",
        scrub: true,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center pt-24 font-sans">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-rose-500 hover:underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-16 font-sans selection:bg-rose-100 selection:text-rose-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Image/Video Carousel (Embla) */}
          <div className="overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-100 relative" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {product.images.length > 0 ? (
                 product.images.map((media, idx) => (
                  <div key={idx} className="relative flex-[0_0_100%] min-w-0 aspect-[4/5]">
                    {media.match(/\.(mp4|webm|mov|ogg)$/i) ? (
                       <video
                         src={media}
                         controls
                         playsInline
                         className="h-full w-full object-cover"
                       />
                    ) : (
                       <img
                         src={media}
                         alt={`${product.name} - view ${idx + 1}`}
                         className="h-full w-full object-cover"
                       />
                    )}
                  </div>
                 ))
              ) : (
                  <div className="flex-[0_0_100%] min-w-0 aspect-[4/5] flex items-center justify-center">
                      <span className="text-gray-400">No media available</span>
                  </div>
              )}
            </div>
            {product.images.length > 1 && (
               <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 pointer-events-none">
                 {product.images.map((_, idx) => (
                   <div key={idx} className="h-2 w-2 rounded-full bg-slate-900/40 backdrop-blur-md mix-blend-overlay"></div>
                 ))}
               </div>
            )}
          </div>

          {/* Product Info (Sticky right side) */}
          <div className="mt-10 px-4 sm:px-0 lg:mt-0">
            <div className="sticky top-24" ref={detailRef}>
              <div className="mb-2 text-sm font-medium text-rose-500 tracking-wider uppercase">
                {product.category?.name ?? "Accessories"}
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{product.name}</h1>
              
              <div className="mt-4">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-slate-900 font-medium">₹{(product.price / 100).toFixed(2)}</p>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>
                <div 
                   className="space-y-6 text-base text-slate-700 leading-relaxed prose prose-slate"
                   dangerouslySetInnerHTML={{ __html: product.description || "" }} 
                />
              </div>

              <div className="mt-8 border-t border-slate-200 pt-8">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full rounded-full border border-transparent bg-slate-900 px-8 py-4 text-base font-semibold text-white hover:bg-slate-800 hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white"
                  >
                    Add to Canvas
                  </button>
              </div>

              {/* Collapsible Details */}
              <div className="mt-10 border-t border-slate-200 pt-8 space-y-6">
                <div className="flex text-sm text-slate-500 justify-between">
                    <span>Stock</span>
                    <span className="font-medium text-slate-900">{product.stockQuantity > 0 ? `${product.stockQuantity} ready to ship` : 'Made to order'}</span>
                </div>
                <div className="flex text-sm text-slate-500 justify-between">
                    <span>Authenticity</span>
                    <span className="font-medium text-slate-900">Signed & verified by artist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
