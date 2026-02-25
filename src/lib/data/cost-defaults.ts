import type { CostInputs } from '@/types/financial';

export const DEFAULT_COSTS: CostInputs = {
  councilRates: 2000,
  waterRates: 1200,
  strata: 0,
  insurance: 2500,
  landTax: 0,
  maintenance: 3000,
  propertyManagement: 0,
  accounting: 1000,
  miscellaneous: 500,
};

export const COST_LABELS: Record<keyof CostInputs, string> = {
  councilRates: 'Council Rates',
  waterRates: 'Water Rates',
  strata: 'Strata / Body Corp',
  insurance: 'Building & Landlord Insurance',
  landTax: 'Land Tax',
  maintenance: 'Maintenance & Repairs',
  propertyManagement: 'Property Management',
  accounting: 'Accounting / Tax Agent',
  miscellaneous: 'Miscellaneous',
};

export const DEFAULT_COST_RANGES: Record<string, { low: number; high: number }> = {
  councilRates: { low: 1200, high: 4000 },
  waterRates: { low: 800, high: 2000 },
  strata: { low: 0, high: 8000 },
  insurance: { low: 1500, high: 4000 },
  landTax: { low: 0, high: 5000 },
  maintenance: { low: 1500, high: 5000 },
  propertyManagement: { low: 0, high: 3000 },
  accounting: { low: 500, high: 2000 },
  miscellaneous: { low: 0, high: 2000 },
};

export const DEFAULT_INCOME = {
  nightlyRate: 200,
  occupancyRate: 70,
  airbnbHostFee: 3,
  cleaningFeePerVisit: 120,
  managementFee: 0,
};

export const DEFAULT_MORTGAGE = {
  lvr: 80,
  interestRate: 6.5,
  loanTermYears: 30,
  conveyancing: 5000,
};
