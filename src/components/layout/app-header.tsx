import { useState } from 'react';
import { Building2, Plus, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PropertySearch } from '@/components/property/property-search';
import { useSaveAnalysis } from '@/hooks/use-analyses';
import { usePropertyStore } from '@/stores/property-store';
import { useFinancialStore } from '@/stores/financial-store';
import { useRenovationStore } from '@/stores/renovation-store';
import { useCapitalGrowthStore } from '@/stores/capital-growth-store';

interface AppHeaderProps {
  onNewAnalysis: () => void;
}

export function AppHeader({ onNewAnalysis }: AppHeaderProps) {
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const saveAnalysis = useSaveAnalysis();

  const address = usePropertyStore((s) => s.address);

  function handleNew() {
    usePropertyStore.getState().resetProperty();
    useFinancialStore.getState().resetFinancials();
    useRenovationStore.getState().clearRenovations();
    useCapitalGrowthStore.getState().resetAll();
    onNewAnalysis();
  }

  function handleOpenSave() {
    setSaveName(address || '');
    setSaveOpen(true);
  }

  function handleSave() {
    const property = usePropertyStore.getState();
    const financial = useFinancialStore.getState();
    const renovations = useRenovationStore.getState().renovations;
    const growth = useCapitalGrowthStore.getState();

    saveAnalysis.mutate(
      {
        name: saveName,
        propertyData: {
          address: property.address,
          suburb: property.suburb,
          state: property.state,
          postcode: property.postcode,
          bedrooms: property.bedrooms,
          propertyType: property.propertyType,
          purchasePrice: property.purchasePrice,
          lastSalePrice: property.lastSalePrice,
          lastSaleDate: property.lastSaleDate,
          suburbMedianPrice: property.suburbMedianPrice,
          suburbGrowthRate: property.suburbGrowthRate,
          domainUrl: property.domainUrl,
        },
        financialData: {
          mortgage: { ...financial.mortgage },
          income: { ...financial.income },
          costs: { ...financial.costs },
        },
        renovations,
        growthRates: {
          growthRates: growth.growthRates,
          defaultRate: growth.defaultRate,
        },
      },
      {
        onSuccess: () => {
          setSaveOpen(false);
          setSaveName('');
        },
      }
    );
  }

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
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleNew}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline ml-1.5">New</span>
            </Button>
            <Button size="sm" onClick={handleOpenSave}>
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline ml-1.5">Save</span>
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Analysis</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="analysis-name">Name</Label>
            <Input
              id="analysis-name"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="e.g. 42 Smith St, Bondi"
              className="mt-1.5"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!saveName.trim() || saveAnalysis.isPending}
            >
              {saveAnalysis.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
