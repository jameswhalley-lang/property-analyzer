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
