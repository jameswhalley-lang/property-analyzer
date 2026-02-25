import { create } from 'zustand';
import type { AustralianState, PropertyType } from '@/types/property';

interface PropertyStore {
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
  setProperty: (updates: Partial<Omit<PropertyStore, 'setProperty' | 'resetProperty'>>) => void;
  resetProperty: () => void;
}

const initialState = {
  address: '',
  suburb: '',
  state: 'NSW' as AustralianState,
  postcode: '',
  bedrooms: 3,
  propertyType: 'house' as PropertyType,
  purchasePrice: 0,
  lastSalePrice: null,
  lastSaleDate: null,
  suburbMedianPrice: null,
  suburbGrowthRate: null,
  domainUrl: null,
};

export const usePropertyStore = create<PropertyStore>((set) => ({
  ...initialState,
  setProperty: (updates) => set((state) => ({ ...state, ...updates })),
  resetProperty: () => set(initialState),
}));
