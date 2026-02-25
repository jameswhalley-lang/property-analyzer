export interface YearProjection {
  year: number;
  growthRate: number;
  propertyValue: number;
  loanBalance: number;
  equity: number;
  cumulativeRentalIncome: number;
  renovationUplift: number;
}

export interface GrowthSummary {
  valueYear10: number;
  valueYear20: number;
  valueYear30: number;
  equityYear10: number;
  equityYear20: number;
  equityYear30: number;
  totalRentalIncome30Years: number;
  totalReturn: number;
}
