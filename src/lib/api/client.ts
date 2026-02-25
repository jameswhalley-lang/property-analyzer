const API_BASE = '/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  property: {
    search: (query: string) =>
      fetchApi<{ results: Array<{ address: string; suburb: string; state: string; postcode: string; url: string }> }>(
        `/property/search?q=${encodeURIComponent(query)}`
      ),
    details: (url: string) =>
      fetchApi<{ lastSalePrice: number | null; lastSaleDate: string | null; bedrooms: number | null; propertyType: string | null }>(
        `/property/details?url=${encodeURIComponent(url)}`
      ),
  },
  suburb: {
    stats: (suburb: string, state: string, postcode: string) =>
      fetchApi<{ medianPrice: number; annualGrowth: number; threeYearGrowth: number; fiveYearGrowth: number; medianRent: number | null }>(
        `/suburb/stats?suburb=${encodeURIComponent(suburb)}&state=${encodeURIComponent(state)}&postcode=${encodeURIComponent(postcode)}`
      ),
  },
  airbnb: {
    rates: (suburb: string, state: string, bedrooms: number) =>
      fetchApi<{ nightlyRateLow: number; nightlyRateMid: number; nightlyRateHigh: number; occupancyLow: number; occupancyMid: number; occupancyHigh: number }>(
        `/airbnb/rates?suburb=${encodeURIComponent(suburb)}&state=${encodeURIComponent(state)}&bedrooms=${bedrooms}`
      ),
  },
  analyses: {
    list: () => fetchApi<{ analyses: Array<{ id: string; name: string; createdAt: string; updatedAt: string }> }>('/analyses'),
    get: (id: string) => fetchApi<Record<string, unknown>>(`/analyses/${id}`),
    create: (data: Record<string, unknown>) =>
      fetchApi<{ id: string }>('/analyses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      fetchApi<{ success: boolean }>(`/analyses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchApi<{ success: boolean }>(`/analyses/${id}`, { method: 'DELETE' }),
  },
};
