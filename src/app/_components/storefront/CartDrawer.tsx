"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

import { useEffect, useState } from "react";

export function CartDrawer() {
  const { isOpen, items, toggleCart, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCheckout = () => {
    // Construct WhatsApp message
    const lines = ["*New Order Request* \n"];
    
    items.forEach((item) => {
      const price = `₹${(item.price / 100).toFixed(2)}`;
      const sub = `₹${((item.price * item.quantity) / 100).toFixed(2)}`;
      lines.push(`${item.quantity}x ${item.name} (${price}) = *${sub}*`);
    });

    const total = `₹${(getSubtotal() / 100).toFixed(2)}`;
    lines.push(`\n*Subtotal: ${total}*`);
    lines.push(`\nPlease let me know if these are in stock and how to make the payment!`);

    const text = encodeURIComponent(lines.join("\n"));
    
    // In production, configure NEXT_PUBLIC_WHATSAPP_NUMBER in .env
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+1234567890";
    
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => toggleCart(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[60] w-full max-w-md transform bg-[#faf9f6] shadow-2xl transition-transform duration-300 ease-in-out sm:max-w-md flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-3" />
            Your Canvas
          </h2>
          <button
            onClick={() => toggleCart(false)}
            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <ShoppingBag className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-900">Your canvas is empty</p>
              <p className="mt-2 text-sm">Discover unique art pieces and curate your collection.</p>
              <button
                onClick={() => toggleCart(false)}
                className="mt-6 text-sm font-medium text-rose-500 hover:text-rose-600 hover:underline"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex py-2">
                  <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                    {item.image ? (
                        /\.(mp4|webm|mov|ogg)$/i.exec(item.image) ? (
                            <video src={item.image} className="h-full w-full object-cover" />
                        ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        )
                    ) : (
                      <div className="h-full w-full bg-slate-200 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3 className="line-clamp-2 leading-tight pr-4">{item.name}</h3>
                        <p className="ml-4 tabular-nums">₹{((item.price * item.quantity) / 100).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{item.stockType === "limited" ? "Limited Edition" : "Made to order"}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border border-gray-200 rounded-full bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-500 hover:text-slate-900 focus:outline-none"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-slate-900 font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-500 hover:text-slate-900 focus:outline-none"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="font-medium text-red-500 hover:text-red-600 flex items-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-200 bg-white p-6 shadow-up">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
              <p>Subtotal</p>
              <p className="tabular-nums">₹{(getSubtotal() / 100).toFixed(2)}</p>
            </div>
            <p className="text-sm text-gray-500 mb-6">Shipping and taxes calculated via WhatsApp.</p>
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center rounded-full border border-transparent bg-green-600 px-6 py-4 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Checkout on WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
