export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'NT' | 'ACT';

export type PropertyType = 'house' | 'apartment' | 'townhouse' | 'unit';

export interface PropertyDetails {
  address: string;
  suburb: string;
  state: AustralianState;
  postcode: string;
  bedrooms: number;
  propertyType: PropertyType;
  purchasePrice: number;
  lastSalePrice: number | null;
  lastSaleDate: string | null;
  suburbMedianPrice: number | null;
  suburbGrowthRate: number | null;
  domainUrl: string | null;
}

export interface SuburbStats {
  medianPrice: number;
  annualGrowth: number;
  threeYearGrowth: number;
  fiveYearGrowth: number;
  medianRent: number | null;
}

export interface PropertySearchResult {
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  url: string;
}
