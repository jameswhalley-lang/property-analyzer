import type { AustralianState } from '@/types/property';

export function calculateStampDuty(price: number, state: AustralianState, isInvestment: boolean = true): number {
  switch (state) {
    case 'NSW': return calculateNSW(price, isInvestment);
    case 'VIC': return calculateVIC(price, isInvestment);
    case 'QLD': return calculateQLD(price, isInvestment);
    case 'SA': return calculateSA(price);
    case 'WA': return calculateWA(price, isInvestment);
    case 'TAS': return calculateTAS(price);
    case 'NT': return calculateNT(price);
    case 'ACT': return calculateACT(price, isInvestment);
    default: return 0;
  }
}

// NSW: uses "per $100 or part thereof" rounding
function calculateNSW(price: number, _isInvestment: boolean): number {
  const units = Math.ceil(price / 100);
  if (price <= 17000) return units * 1.25;
  if (price <= 36000) return 212 + (units - 170) * 1.50;
  if (price <= 97000) return 497 + (units - 360) * 1.75;
  if (price <= 364000) return 1564 + (units - 970) * 3.50;
  if (price <= 1212000) return 10912 + (units - 3640) * 4.50;
  // Over $1,212,000: $45,956 + $5.50 per $100 (or part) over $1,212,000
  return 45956 + (units - 12120) * 5.50;
}

// VIC: standard rates for investment
function calculateVIC(price: number, _isInvestment: boolean): number {
  if (price <= 25000) return price * 0.014;
  if (price <= 130000) return 350 + (price - 25000) * 0.024;
  if (price <= 960000) return 2870 + (price - 130000) * 0.06;
  // $960,001 to $2,000,000: flat 5.5%
  if (price <= 2000000) return price * 0.055;
  // Over $2M: flat 6.5%
  return price * 0.065;
}

// QLD: separate investor rates (higher transfer duty)
function calculateQLD(price: number, isInvestment: boolean): number {
  if (isInvestment) {
    // QLD investor rates
    if (price <= 5000) return 0;
    if (price <= 75000) return price * 0.015;
    if (price <= 540000) return 1050 + (price - 75000) * 0.035;
    if (price <= 1000000) return 17325 + (price - 540000) * 0.045;
    return 38025 + (price - 1000000) * 0.0575;
  }
  // QLD owner-occupier rates (not typically used for investment)
  if (price <= 5000) return 0;
  if (price <= 75000) return price * 0.015;
  if (price <= 540000) return 1050 + (price - 75000) * 0.035;
  if (price <= 1000000) return 17325 + (price - 540000) * 0.045;
  return 38025 + (price - 1000000) * 0.0575;
}

// SA: same for all buyers
function calculateSA(price: number): number {
  if (price <= 12000) return price * 0.01;
  if (price <= 30000) return 120 + (price - 12000) * 0.02;
  if (price <= 50000) return 480 + (price - 30000) * 0.03;
  if (price <= 100000) return 1080 + (price - 50000) * 0.035;
  if (price <= 200000) return 2830 + (price - 100000) * 0.04;
  if (price <= 250000) return 6830 + (price - 200000) * 0.0425;
  if (price <= 300000) return 8955 + (price - 250000) * 0.0475;
  if (price <= 500000) return 11330 + (price - 300000) * 0.05;
  return 21330 + (price - 500000) * 0.055;
}

// WA: standard rates
function calculateWA(price: number, _isInvestment: boolean): number {
  if (price <= 120000) return price * 0.019;
  if (price <= 150000) return 2280 + (price - 120000) * 0.0285;
  if (price <= 360000) return 3135 + (price - 150000) * 0.038;
  if (price <= 725000) return 11115 + (price - 360000) * 0.0475;
  return 28453 + (price - 725000) * 0.0515;
}

// TAS: standard rates
function calculateTAS(price: number): number {
  if (price <= 3000) return 50;
  if (price <= 25000) return 50 + (price - 3000) * 0.0175;
  if (price <= 75000) return 435 + (price - 25000) * 0.025;
  if (price <= 200000) return 1685 + (price - 75000) * 0.035;
  if (price <= 375000) return 6060 + (price - 200000) * 0.04;
  if (price <= 725000) return 13060 + (price - 375000) * 0.0425;
  return 27935 + (price - 725000) * 0.045;
}

// NT: standard rates
function calculateNT(price: number): number {
  // NT uses a formula-based approach. Simplified bracket version:
  if (price <= 525000) {
    // V = (0.06571441 * D^2) + 15 where D = dutiable value / 1000
    const d = price / 1000;
    return Math.max(0, Math.round(0.06571441 * d * d + 15));
  }
  // Over $525,000: rate of 5.95% on the total value minus $4,929.60
  return price * 0.0595;
}

// ACT: standard rates (investment property - no concessions)
function calculateACT(price: number, _isInvestment: boolean): number {
  if (price <= 260000) return price * 0.012;
  if (price <= 300000) return 3120 + (price - 260000) * 0.021;
  if (price <= 500000) return 3960 + (price - 300000) * 0.0424;
  if (price <= 750000) return 12440 + (price - 500000) * 0.0558;
  if (price <= 1000000) return 26390 + (price - 750000) * 0.064;
  if (price <= 1455000) return 42390 + (price - 1000000) * 0.072;
  return 75150 + (price - 1455000) * 0.05;
}
