import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../../../shared/storage/mmkv';
import { clampQuantity } from '../utils/cartMath';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  discountPercent: number;
  quantity: number;
  imageSeed: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  clearCart: () => void;
}

// MMKV-backed storage adapter for zustand persist middleware
const zustandMmkvStorage = {
  getItem: (name: string) => mmkvStorage.getString(name) ?? null,
  setItem: (name: string, value: string) => mmkvStorage.setString(name, value),
  removeItem: (name: string) => mmkvStorage.delete(name),
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: clampQuantity(i.quantity + quantity) }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: clampQuantity(quantity) }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity: clampQuantity(quantity) } : i
          ),
        });
      },

      incrementQuantity: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        if (item) get().updateQuantity(productId, item.quantity + 1);
      },

      decrementQuantity: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        if (!item) return;
        if (item.quantity <= 1) {
          get().removeItem(productId);
        } else {
          get().updateQuantity(productId, item.quantity - 1);
        }
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => zustandMmkvStorage),
    }
  )
);