export interface MortgageCalcResult {
  loanAmount: number;
  monthlyRepayment: number;
  annualRepayment: number;
  totalInterest: number;
  totalRepayment: number;
  depositRequired: number;
}

export function calculateMortgage(
  purchasePrice: number,
  stampDuty: number,
  lvr: number,
  interestRate: number,
  loanTermYears: number,
  conveyancing: number
): MortgageCalcResult {
  const totalCost = purchasePrice + stampDuty + conveyancing;
  const loanAmount = (lvr / 100) * purchasePrice;
  const depositRequired = totalCost - loanAmount;

  const monthlyRate = interestRate / 12 / 100;
  const numPayments = loanTermYears * 12;

  let monthlyRepayment: number;
  if (monthlyRate === 0) {
    monthlyRepayment = loanAmount / numPayments;
  } else {
    monthlyRepayment =
      loanAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  const totalRepayment = monthlyRepayment * numPayments;
  const totalInterest = totalRepayment - loanAmount;

  return {
    loanAmount,
    monthlyRepayment,
    annualRepayment: monthlyRepayment * 12,
    totalInterest,
    totalRepayment,
    depositRequired,
  };
}

export function calculateRemainingBalance(
  loanAmount: number,
  interestRate: number,
  loanTermYears: number,
  yearsElapsed: number
): number {
  const monthlyRate = interestRate / 12 / 100;
  const numPayments = loanTermYears * 12;
  const paymentsMade = yearsElapsed * 12;

  if (monthlyRate === 0) {
    return loanAmount * (1 - paymentsMade / numPayments);
  }

  const monthlyRepayment =
    loanAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  const balance =
    loanAmount * Math.pow(1 + monthlyRate, paymentsMade) -
    monthlyRepayment *
      ((Math.pow(1 + monthlyRate, paymentsMade) - 1) / monthlyRate);

  return Math.max(0, balance);
}
