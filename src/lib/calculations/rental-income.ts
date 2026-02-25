export interface RentalIncomeResult {
  annualBookings: number;
  grossIncome: number;
  airbnbFees: number;
  cleaningVisits: number;
  annualCleaning: number;
  managementFees: number;
  netIncome: number;
}

export function calculateRentalIncome(
  nightlyRate: number,
  occupancyRate: number,
  airbnbHostFee: number,
  cleaningFeePerVisit: number,
  managementFee: number
): RentalIncomeResult {
  const annualBookings = Math.round((occupancyRate / 100) * 365);
  const grossIncome = nightlyRate * annualBookings;
  const airbnbFees = grossIncome * (airbnbHostFee / 100);
  // Conservative: average 2-night stays → ~50% of booked nights are check-ins
  const cleaningVisits = Math.floor((occupancyRate / 100) * 365 * 0.50);
  const annualCleaning = cleaningVisits * cleaningFeePerVisit;
  const managementFees = grossIncome * (managementFee / 100);
  const netIncome = grossIncome - airbnbFees - annualCleaning - managementFees;

  return {
    annualBookings,
    grossIncome,
    airbnbFees,
    cleaningVisits,
    annualCleaning,
    managementFees,
    netIncome,
  };
}
