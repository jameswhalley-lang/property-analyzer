export interface Renovation {
  id: string;
  name: string;
  cost: number;
  year: number; // year 0 = at purchase, year 1-30
  capitalGrowthImpact: number; // percentage added to property value
  nightlyRateImpact: number; // dollar amount added to nightly rate
}
