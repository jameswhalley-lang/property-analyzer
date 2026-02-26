import { create } from 'zustand';

interface CashflowProjectionStore {
  rentalGrowthRates: number[]; // 30 entries (year 1-30)
  costGrowthRates: number[]; // 30 entries (year 1-30)
  setRentalGrowthRate: (yearIndex: number, rate: number) => void;
  setAllRentalGrowthRates: (rate: number) => void;
  setCostGrowthRate: (yearIndex: number, rate: number) => void;
  setAllCostGrowthRates: (rate: number) => void;
  resetAll: () => void;
  hydrateRates: (rentalGrowthRates: number[], costGrowthRates: number[]) => void;
}

const DEFAULT_RENTAL_GROWTH_RATE = 3;
const DEFAULT_COST_GROWTH_RATE = 2.5;

export const useCashflowProjectionStore = create<CashflowProjectionStore>((set) => ({
  rentalGrowthRates: Array(30).fill(DEFAULT_RENTAL_GROWTH_RATE),
  costGrowthRates: Array(30).fill(DEFAULT_COST_GROWTH_RATE),
  setRentalGrowthRate: (yearIndex, rate) =>
    set((state) => {
      const newRates = [...state.rentalGrowthRates];
      newRates[yearIndex] = rate;
      return { rentalGrowthRates: newRates };
    }),
  setAllRentalGrowthRates: (rate) =>
    set({ rentalGrowthRates: Array(30).fill(rate) }),
  setCostGrowthRate: (yearIndex, rate) =>
    set((state) => {
      const newRates = [...state.costGrowthRates];
      newRates[yearIndex] = rate;
      return { costGrowthRates: newRates };
    }),
  setAllCostGrowthRates: (rate) =>
    set({ costGrowthRates: Array(30).fill(rate) }),
  resetAll: () =>
    set({
      rentalGrowthRates: Array(30).fill(DEFAULT_RENTAL_GROWTH_RATE),
      costGrowthRates: Array(30).fill(DEFAULT_COST_GROWTH_RATE),
    }),
  hydrateRates: (rentalGrowthRates, costGrowthRates) =>
    set({ rentalGrowthRates, costGrowthRates }),
}));
