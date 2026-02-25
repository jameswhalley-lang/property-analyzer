import { create } from 'zustand';
import type { MortgageInputs, IncomeInputs, CostInputs } from '@/types/financial';
import { DEFAULT_COSTS, DEFAULT_INCOME, DEFAULT_MORTGAGE } from '@/lib/data/cost-defaults';

interface FinancialStore {
  mortgage: MortgageInputs;
  income: IncomeInputs;
  costs: CostInputs;
  setMortgage: (updates: Partial<MortgageInputs>) => void;
  setIncome: (updates: Partial<IncomeInputs>) => void;
  setCosts: (updates: Partial<CostInputs>) => void;
  setCost: (key: keyof CostInputs, value: number) => void;
  resetFinancials: () => void;
}

const initialMortgage: MortgageInputs = {
  lvr: DEFAULT_MORTGAGE.lvr,
  interestRate: DEFAULT_MORTGAGE.interestRate,
  loanTermYears: DEFAULT_MORTGAGE.loanTermYears,
  stampDutyOverride: null,
  conveyancing: DEFAULT_MORTGAGE.conveyancing,
};

const initialIncome: IncomeInputs = {
  nightlyRate: DEFAULT_INCOME.nightlyRate,
  occupancyRate: DEFAULT_INCOME.occupancyRate,
  airbnbHostFee: DEFAULT_INCOME.airbnbHostFee,
  cleaningFeePerVisit: DEFAULT_INCOME.cleaningFeePerVisit,
  managementFee: DEFAULT_INCOME.managementFee,
};

export const useFinancialStore = create<FinancialStore>((set) => ({
  mortgage: initialMortgage,
  income: initialIncome,
  costs: { ...DEFAULT_COSTS },
  setMortgage: (updates) =>
    set((state) => ({ mortgage: { ...state.mortgage, ...updates } })),
  setIncome: (updates) =>
    set((state) => ({ income: { ...state.income, ...updates } })),
  setCosts: (updates) =>
    set((state) => ({ costs: { ...state.costs, ...updates } })),
  setCost: (key, value) =>
    set((state) => ({ costs: { ...state.costs, [key]: value } })),
  resetFinancials: () =>
    set({ mortgage: initialMortgage, income: initialIncome, costs: { ...DEFAULT_COSTS } }),
}));
