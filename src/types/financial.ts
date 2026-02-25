export interface MortgageInputs {
  lvr: number; // percentage 0-100
  interestRate: number; // annual percentage
  loanTermYears: number;
  stampDutyOverride: number | null; // null = auto-calculate
  conveyancing: number;
}

export interface IncomeInputs {
  nightlyRate: number;
  occupancyRate: number; // percentage 0-100
  airbnbHostFee: number; // percentage 0-100
  cleaningFeePerVisit: number;
  managementFee: number; // percentage 0-100 of gross income
}

export interface CostInputs {
  councilRates: number;
  waterRates: number;
  strata: number;
  insurance: number;
  landTax: number;
  maintenance: number;
  propertyManagement: number;
  accounting: number;
  miscellaneous: number;
}

export interface SuburbGuideRange {
  low: number;
  high: number;
}

export interface CostRanges {
  councilRates: SuburbGuideRange | null;
  waterRates: SuburbGuideRange | null;
  strata: SuburbGuideRange | null;
  insurance: SuburbGuideRange | null;
  landTax: SuburbGuideRange | null;
  maintenance: SuburbGuideRange | null;
}

export interface AirbnbRateRange {
  nightlyRateLow: number;
  nightlyRateMid: number;
  nightlyRateHigh: number;
  occupancyLow: number;
  occupancyMid: number;
  occupancyHigh: number;
}
