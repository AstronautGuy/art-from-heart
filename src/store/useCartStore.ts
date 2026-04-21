import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  stockType: string;
  stockQuantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            // Check stock limits if limited
            const maxAllowed = item.stockType === "limited" ? item.stockQuantity : 99;
            const newQuantity = Math.min(existing.quantity + item.quantity, maxAllowed);
            
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: newQuantity } : i
              ),
              isOpen: true, // Auto open cart on add
            };
          }
          return { items: [...state.items, item], isOpen: true };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;

          const maxAllowed = item.stockType === "limited" ? item.stockQuantity : 99;
          const validQuantity = Math.max(1, Math.min(quantity, maxAllowed));

          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: validQuantity } : i
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: (open) => {
        set((state) => ({ isOpen: open ?? !state.isOpen }));
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "art-from-heart-cart", // key in local storage
      partialize: (state) => ({ items: state.items }), // Only persist items, not isOpen state
    }
  )
);
