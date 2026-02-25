import type { YearProjection, GrowthSummary } from '@/types/capital-growth';
import type { Renovation } from '@/types/renovation';
import { calculateRemainingBalance } from './mortgage';

export function calculateCapitalGrowthProjection(
  purchasePrice: number,
  growthRates: number[], // 30 entries, one per year (%)
  renovations: Renovation[],
  loanAmount: number,
  interestRate: number,
  loanTermYears: number,
  annualNetRentalIncome: number
): YearProjection[] {
  const projections: YearProjection[] = [];
  let currentValue = purchasePrice;
  let cumulativeRentalIncome = 0;

  for (let year = 0; year <= 30; year++) {
    const loanBalance = calculateRemainingBalance(
      loanAmount,
      interestRate,
      loanTermYears,
      year
    );

    // Get renovations for this year
    const yearRenovations = renovations.filter((r) => r.year === year);
    const renovationUplift = yearRenovations.reduce(
      (sum, r) => sum + currentValue * (r.capitalGrowthImpact / 100),
      0
    );

    if (year > 0) {
      const rate = growthRates[year - 1] ?? 5; // default 5% if missing
      currentValue = currentValue * (1 + rate / 100) + renovationUplift;
      cumulativeRentalIncome += annualNetRentalIncome;
    }

    projections.push({
      year,
      growthRate: year === 0 ? 0 : (growthRates[year - 1] ?? 5),
      propertyValue: Math.round(currentValue),
      loanBalance: Math.round(loanBalance),
      equity: Math.round(currentValue - loanBalance),
      cumulativeRentalIncome: Math.round(cumulativeRentalIncome),
      renovationUplift: Math.round(renovationUplift),
    });
  }

  return projections;
}

export function calculateGrowthSummary(projections: YearProjection[]): GrowthSummary {
  const year10 = projections[10] ?? projections[projections.length - 1];
  const year20 = projections[20] ?? projections[projections.length - 1];
  const year30 = projections[30] ?? projections[projections.length - 1];

  return {
    valueYear10: year10.propertyValue,
    valueYear20: year20.propertyValue,
    valueYear30: year30.propertyValue,
    equityYear10: year10.equity,
    equityYear20: year20.equity,
    equityYear30: year30.equity,
    totalRentalIncome30Years: year30.cumulativeRentalIncome,
    totalReturn: year30.equity + year30.cumulativeRentalIncome,
  };
}
