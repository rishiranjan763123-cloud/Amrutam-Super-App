import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../../../shared/storage/mmkv';

interface HeldSlot {
  doctorId: string;
  slotId: string;
  startTime: string;
  endTime: string;
  heldAt: number;
}

interface ConsultationState {
  heldSlot: HeldSlot | null;
  recentlyViewedDoctorIds: string[];
  holdSlot: (slot: Omit<HeldSlot, 'heldAt'>) => void;
  releaseSlot: () => void;
  addRecentlyViewed: (doctorId: string) => void;
}

const zustandMmkvStorage = {
  getItem: (name: string) => mmkvStorage.getString(name) ?? null,
  setItem: (name: string, value: string) => mmkvStorage.setString(name, value),
  removeItem: (name: string) => mmkvStorage.delete(name),
};

export const useConsultationStore = create<ConsultationState>()(
  persist(
    (set, get) => ({
      heldSlot: null,
      recentlyViewedDoctorIds: [],

      holdSlot: (slot) => set({ heldSlot: { ...slot, heldAt: Date.now() } }),

      releaseSlot: () => set({ heldSlot: null }),

      addRecentlyViewed: (doctorId) => {
        const current = get().recentlyViewedDoctorIds.filter((id) => id !== doctorId);
        set({ recentlyViewedDoctorIds: [doctorId, ...current].slice(0, 10) });
      },
    }),
    {
      name: 'consultation-storage',
      storage: createJSONStorage(() => zustandMmkvStorage),
    }
  )
);