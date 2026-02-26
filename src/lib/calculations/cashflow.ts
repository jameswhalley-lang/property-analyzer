import type { CostInputs } from '@/types/financial';

export interface CashflowResult {
  netRentalIncome: number;
  totalAnnualCosts: number;
  annualMortgageRepayment: number;
  annualCashflow: number;
  monthlyCashflow: number;
  weeklyCashflow: number;
  grossYield: number;
  netYield: number;
  costBreakdown: { label: string; amount: number }[];
}

export function calculateCashflow(
  netRentalIncome: number,
  costs: CostInputs,
  annualMortgageRepayment: number,
  purchasePrice: number,
  grossIncome: number,
  totalInvestment: number
): CashflowResult {
  const costBreakdown = [
    { label: 'Council Rates', amount: costs.councilRates },
    { label: 'Water Rates', amount: costs.waterRates },
    { label: 'Strata / Body Corp', amount: costs.strata },
    { label: 'Insurance', amount: costs.insurance },
    { label: 'Land Tax', amount: costs.landTax },
    { label: 'Maintenance', amount: costs.maintenance },
    { label: 'Property Management', amount: costs.propertyManagement },
    { label: 'Accounting', amount: costs.accounting },
    { label: 'Miscellaneous', amount: costs.miscellaneous },
  ];

  const totalAnnualCosts = costBreakdown.reduce((sum, c) => sum + c.amount, 0);
  const annualCashflow = netRentalIncome - totalAnnualCosts - annualMortgageRepayment;
  const monthlyCashflow = annualCashflow / 12;
  const weeklyCashflow = annualCashflow / 52;
  const grossYield = purchasePrice > 0 ? (grossIncome / purchasePrice) * 100 : 0;
  const netYield = totalInvestment > 0 ? (annualCashflow / totalInvestment) * 100 : 0;

  return {
    netRentalIncome,
    totalAnnualCosts,
    annualMortgageRepayment,
    annualCashflow,
    monthlyCashflow,
    weeklyCashflow,
    grossYield,
    netYield,
    costBreakdown,
  };
}

export interface CashflowYearProjection {
  year: number;
  rentalGrowthRate: number;
  costGrowthRate: number;
  netRentalIncome: number;
  totalCosts: number;
  mortgageRepayment: number;
  annualCashflow: number;
  cumulativeCashflow: number;
}

export function computeCAGR(rates: number[]): number {
  if (rates.length === 0) return 0;
  const product = rates.reduce((acc, rate) => acc * (1 + rate / 100), 1);
  return (Math.pow(product, 1 / rates.length) - 1) * 100;
}

export function calculateCashflowProjection(
  baseNetIncome: number,
  baseTotalCosts: number,
  annualMortgage: number,
  rentalGrowthRates: number[],
  costGrowthRates: number[]
): CashflowYearProjection[] {
  const projections: CashflowYearProjection[] = [];

  const year0Cashflow = baseNetIncome - baseTotalCosts - annualMortgage;
  projections.push({
    year: 0,
    rentalGrowthRate: 0,
    costGrowthRate: 0,
    netRentalIncome: baseNetIncome,
    totalCosts: baseTotalCosts,
    mortgageRepayment: annualMortgage,
    annualCashflow: year0Cashflow,
    cumulativeCashflow: year0Cashflow,
  });

  let currentIncome = baseNetIncome;
  let currentCosts = baseTotalCosts;
  let cumulative = year0Cashflow;

  for (let i = 0; i < 30; i++) {
    const rentalRate = rentalGrowthRates[i] ?? 0;
    const costRate = costGrowthRates[i] ?? 0;

    currentIncome = currentIncome * (1 + rentalRate / 100);
    currentCosts = currentCosts * (1 + costRate / 100);
    const annual = currentIncome - currentCosts - annualMortgage;
    cumulative += annual;

    projections.push({
      year: i + 1,
      rentalGrowthRate: rentalRate,
      costGrowthRate: costRate,
      netRentalIncome: currentIncome,
      totalCosts: currentCosts,
      mortgageRepayment: annualMortgage,
      annualCashflow: annual,
      cumulativeCashflow: cumulative,
    });
  }

  return projections;
}
