import { create } from 'zustand';

interface CapitalGrowthStore {
  growthRates: number[]; // 30 entries (year 1-30)
  defaultRate: number;
  setGrowthRate: (yearIndex: number, rate: number) => void;
  setAllRates: (rate: number) => void;
  resetRates: () => void;
  setDefaultRate: (rate: number) => void;
}

const DEFAULT_GROWTH_RATE = 5;

export const useCapitalGrowthStore = create<CapitalGrowthStore>((set) => ({
  growthRates: Array(30).fill(DEFAULT_GROWTH_RATE),
  defaultRate: DEFAULT_GROWTH_RATE,
  setGrowthRate: (yearIndex, rate) =>
    set((state) => {
      const newRates = [...state.growthRates];
      newRates[yearIndex] = rate;
      return { growthRates: newRates };
    }),
  setAllRates: (rate) =>
    set({ growthRates: Array(30).fill(rate), defaultRate: rate }),
  resetRates: () =>
    set((state) => ({
      growthRates: Array(30).fill(state.defaultRate),
    })),
  setDefaultRate: (rate) =>
    set({ defaultRate: rate, growthRates: Array(30).fill(rate) }),
}));
