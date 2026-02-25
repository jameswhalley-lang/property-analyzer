import { useState, useEffect } from 'react';
import type { Renovation } from '@/types/renovation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddRenovationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Renovation;
  onSave: (renovation: Renovation) => void;
}

export function AddRenovationDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: AddRenovationDialogProps) {
  const [name, setName] = useState('');
  const [cost, setCost] = useState(0);
  const [year, setYear] = useState(0);
  const [capitalGrowthImpact, setCapitalGrowthImpact] = useState(0);
  const [nightlyRateImpact, setNightlyRateImpact] = useState(0);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name);
        setCost(initialData.cost);
        setYear(initialData.year);
        setCapitalGrowthImpact(initialData.capitalGrowthImpact);
        setNightlyRateImpact(initialData.nightlyRateImpact);
      } else {
        setName('');
        setCost(0);
        setYear(0);
        setCapitalGrowthImpact(0);
        setNightlyRateImpact(0);
      }
    }
  }, [open, initialData]);

  function handleSave() {
    const renovation: Renovation = {
      id: initialData?.id ?? crypto.randomUUID(),
      name: name.trim() || 'Untitled Renovation',
      cost,
      year: Math.min(30, Math.max(0, year)),
      capitalGrowthImpact,
      nightlyRateImpact,
    };
    onSave(renovation);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Renovation' : 'Add Renovation'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="reno-name">Name</Label>
            <Input
              id="reno-name"
              type="text"
              placeholder="e.g. Kitchen remodel"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reno-cost">Cost</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                id="reno-cost"
                type="number"
                min={0}
                step={100}
                value={cost}
                onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                className="pl-7"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reno-year">Year (0 = at purchase)</Label>
            <Input
              id="reno-year"
              type="number"
              min={0}
              max={30}
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10) || 0)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reno-capital">Capital Growth Impact (%)</Label>
            <div className="relative">
              <Input
                id="reno-capital"
                type="number"
                step={0.1}
                value={capitalGrowthImpact}
                onChange={(e) =>
                  setCapitalGrowthImpact(parseFloat(e.target.value) || 0)
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reno-nightly">Nightly Rate Impact ($)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                id="reno-nightly"
                type="number"
                min={0}
                step={5}
                value={nightlyRateImpact}
                onChange={(e) =>
                  setNightlyRateImpact(parseFloat(e.target.value) || 0)
                }
                className="pl-7"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
