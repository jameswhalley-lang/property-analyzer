import { Building2 } from 'lucide-react';
import { PropertySearch } from '@/components/property/property-search';

export function AppHeader() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <Building2 className="h-6 w-6 text-primary" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold leading-none">Property Analyzer</h1>
              <p className="text-xs text-muted-foreground">Australian Investment Property Analysis</p>
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <PropertySearch />
          </div>
        </div>
      </div>
    </header>
  );
}
