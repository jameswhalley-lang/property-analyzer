import { useMemo } from 'react';
import { usePropertyStore } from '@/stores/property-store';
import { useFinancialStore } from '@/stores/financial-store';
import { useRenovationStore } from '@/stores/renovation-store';
import { useCapitalGrowthStore } from '@/stores/capital-growth-store';
import { calculateStampDuty } from '@/lib/calculations/stamp-duty';
import { calculateMortgage } from '@/lib/calculations/mortgage';
import { calculateRentalIncome } from '@/lib/calculations/rental-income';
import { calculateCashflow } from '@/lib/calculations/cashflow';
import {
  calculateCapitalGrowthProjection,
  calculateGrowthSummary,
} from '@/lib/calculations/capital-growth';

export function useCalculations() {
  const property = usePropertyStore();
  const { mortgage, income, costs } = useFinancialStore();
  const { renovations } = useRenovationStore();
  const { growthRates } = useCapitalGrowthStore();

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

    const rentalIncome = calculateRentalIncome(
      income.nightlyRate,
      income.occupancyRate,
      income.airbnbHostFee,
      income.cleaningFeePerVisit,
      income.managementFee
    );

    const totalInvestment = mortgageCalc.depositRequired;

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
      rentalIncome.netIncome
    );

    const growthSummary = calculateGrowthSummary(projections);

    return {
      stampDuty,
      mortgage: mortgageCalc,
      rentalIncome,
      cashflow,
      projections,
      growthSummary,
      totalInvestment,
    };
  }, [property, mortgage, income, costs, renovations, growthRates]);
}
