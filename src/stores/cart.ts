import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  pricePerMonth: number;
  duration: string;
  durationMultiplier: number;
  dosageAmount: number;
  dosageUnit: string;
  timingSchedule: string;
  isProtocol?: boolean;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateDuration: (productId: string, duration: string, multiplier: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i.productId === item.productId);
          if (exists) return state;
          return { items: [...state.items, item] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateDuration: (productId, duration, multiplier) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, duration, durationMultiplier: multiplier }
              : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.pricePerMonth * item.durationMultiplier,
          0
        ),
    }),
    { name: "cart-storage" }
  )
);
