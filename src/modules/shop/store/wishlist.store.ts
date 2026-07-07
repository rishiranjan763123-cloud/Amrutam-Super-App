import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../../../shared/storage/mmkv';

interface WishlistState {
  productIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

const zustandMmkvStorage = {
  getItem: (name: string) => mmkvStorage.getString(name) ?? null,
  setItem: (name: string, value: string) => mmkvStorage.setString(name, value),
  removeItem: (name: string) => mmkvStorage.delete(name),
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      toggleWishlist: (productId) => {
        const exists = get().productIds.includes(productId);
        set({
          productIds: exists
            ? get().productIds.filter((id) => id !== productId)
            : [...get().productIds, productId],
        });
      },

      isWishlisted: (productId) => get().productIds.includes(productId),

      clearWishlist: () => set({ productIds: [] }),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => zustandMmkvStorage),
    }
  )
);