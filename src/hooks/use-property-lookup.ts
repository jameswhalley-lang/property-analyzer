import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export function usePropertySearch(query: string) {
  return useQuery({
    queryKey: ['property-search', query],
    queryFn: () => api.property.search(query),
    enabled: query.length >= 3,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePropertyDetails(url: string | null) {
  return useQuery({
    queryKey: ['property-details', url],
    queryFn: () => api.property.details(url!),
    enabled: !!url,
    staleTime: 30 * 60 * 1000,
  });
}

export function useSuburbStats(suburb: string, state: string, postcode: string) {
  return useQuery({
    queryKey: ['suburb-stats', suburb, state, postcode],
    queryFn: () => api.suburb.stats(suburb, state, postcode),
    enabled: !!suburb && !!state && !!postcode,
    staleTime: 60 * 60 * 1000,
  });
}

export function useAirbnbRates(suburb: string, state: string, bedrooms: number) {
  return useQuery({
    queryKey: ['airbnb-rates', suburb, state, bedrooms],
    queryFn: () => api.airbnb.rates(suburb, state, bedrooms),
    enabled: !!suburb && !!state && bedrooms > 0,
    staleTime: 60 * 60 * 1000,
  });
}
