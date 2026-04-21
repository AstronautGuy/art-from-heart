"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Product = {
  id: string;
  name: string;
  price: number;
  featured: boolean;
  images: string[];
  category: { id: string; name: string } | null;
};

export function ProductGrid({ products }: { products: Product[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    
    const elements = gridRef.current.children;
    
    gsap.fromTo(
      elements,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
    >
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.id}`} className="group relative block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-lg">
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-50 xl:aspect-h-8 xl:aspect-w-7 relative">
            {product.featured && (
              <div className="absolute top-2 left-2 z-10 rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                Featured
              </div>
            )}
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-300">
                No image
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-50 bg-white/50 backdrop-blur-md relative z-20">
            <h3 className="text-sm font-medium text-gray-900 mb-1">{product.name}</h3>
            <p className="text-xs text-gray-500 mb-3">{product.category?.name ?? "General"}</p>
            <p className="text-sm font-semibold text-gray-900">₹{(product.price / 100).toFixed(2)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
