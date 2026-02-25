import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePropertyStore } from '@/stores/property-store';
import { usePropertySearch } from '@/hooks/use-property-lookup';
import { cn } from '@/lib/utils';

export function PropertySearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const setProperty = usePropertyStore((s) => s.setProperty);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = usePropertySearch(query);
  const results = data?.results ?? [];

  const handleSelect = useCallback(
    (result: (typeof results)[0]) => {
      setProperty({
        address: result.address,
        suburb: result.suburb,
        state: result.state as 'NSW' | 'VIC' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'NT' | 'ACT',
        postcode: result.postcode,
        domainUrl: result.url || null,
      });
      setQuery(result.address);
      setIsOpen(false);
    },
    [setProperty]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search property address..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="pl-9 pr-9"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          <ul className="py-1">
            {results.map((result, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => handleSelect(result)}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors',
                    'focus:bg-accent focus:outline-none'
                  )}
                >
                  <span className="font-medium">{result.address}</span>
                  {result.suburb && (
                    <span className="ml-1 text-muted-foreground">
                      {result.suburb}, {result.state} {result.postcode}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
