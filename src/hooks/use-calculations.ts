import { useMemo } from 'react';
import { usePropertyStore } from '@/stores/property-store';
import { useFinancialStore } from '@/stores/financial-store';
import { useRenovationStore } from '@/stores/renovation-store';
import { useCapitalGrowthStore } from '@/stores/capital-growth-store';
import { calculateStampDuty } from '@/lib/calculations/stamp-duty';
import { calculateMortgage } from '@/lib/calculations/mortgage';
import { calculateRentalIncome } from '@/lib/calculations/rental-income';
import { calculateCashflow, calculateCashflowProjection } from '@/lib/calculations/cashflow';
import { useCashflowProjectionStore } from '@/stores/cashflow-projection-store';
import {
  calculateCapitalGrowthProjection,
  calculateGrowthSummary,
} from '@/lib/calculations/capital-growth';

export function useCalculations() {
  const property = usePropertyStore();
  const { mortgage, income, costs } = useFinancialStore();
  const { renovations } = useRenovationStore();
  const { growthRates } = useCapitalGrowthStore();
  const { rentalGrowthRates, costGrowthRates } = useCashflowProjectionStore();

  return useMemo(() => {
    const stampDuty =
      mortgage.stampDutyOverride ??
      calculateStampDuty(property.purchasePrice, property.state, true);

    const mortgageCalc = calculateMortgage(
      property.purchasePrice,
      stampDuty,
      mortgage.lvr,
      mortgage.interestRate,
      mortgage.loanTermYears,
      mortgage.conveyancing
    );

    // Include year-0 renovation nightly rate impacts in base rental income
    const year0NightlyBoost = renovations
      .filter((r) => r.year === 0)
      .reduce((sum, r) => sum + r.nightlyRateImpact, 0);

    const rentalIncome = calculateRentalIncome(
      income.nightlyRate + year0NightlyBoost,
      income.occupancyRate,
      income.airbnbHostFee,
      income.cleaningFeePerVisit,
      income.managementFee
    );

    // Include year-0 renovation costs in total investment
    const year0RenovationCost = renovations
      .filter((r) => r.year === 0)
      .reduce((sum, r) => sum + r.cost, 0);
    const totalInvestment = mortgageCalc.depositRequired + year0RenovationCost;

    const cashflow = calculateCashflow(
      rentalIncome.netIncome,
      costs,
      mortgageCalc.annualRepayment,
      property.purchasePrice,
      rentalIncome.grossIncome,
      totalInvestment
    );

    const projections = calculateCapitalGrowthProjection(
      property.purchasePrice,
      growthRates,
      renovations,
      mortgageCalc.loanAmount,
      mortgage.interestRate,
      mortgage.loanTermYears,
      rentalIncome.netIncome,
      rentalGrowthRates
    );

    const growthSummary = calculateGrowthSummary(projections);

    const cashflowProjections = calculateCashflowProjection(
      rentalIncome.netIncome,
      cashflow.totalAnnualCosts,
      mortgageCalc.annualRepayment,
      rentalGrowthRates,
      costGrowthRates,
      renovations
    );

    return {
      stampDuty,
      mortgage: mortgageCalc,
      rentalIncome,
      cashflow,
      projections,
      growthSummary,
      totalInvestment,
      cashflowProjections,
    };
  }, [property, mortgage, income, costs, renovations, growthRates, rentalGrowthRates, costGrowthRates]);
}
