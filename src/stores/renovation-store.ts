import { create } from 'zustand';
import type { Renovation } from '@/types/renovation';

interface RenovationStore {
  renovations: Renovation[];
  addRenovation: (renovation: Renovation) => void;
  updateRenovation: (id: string, updates: Partial<Renovation>) => void;
  removeRenovation: (id: string) => void;
  clearRenovations: () => void;
}

export const useRenovationStore = create<RenovationStore>((set) => ({
  renovations: [],
  addRenovation: (renovation) =>
    set((state) => ({ renovations: [...state.renovations, renovation] })),
  updateRenovation: (id, updates) =>
    set((state) => ({
      renovations: state.renovations.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),
  removeRenovation: (id) =>
    set((state) => ({
      renovations: state.renovations.filter((r) => r.id !== id),
    })),
  clearRenovations: () => set({ renovations: [] }),
}));
