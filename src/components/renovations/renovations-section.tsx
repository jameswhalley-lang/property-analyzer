import { useState } from 'react';
import type { Renovation } from '@/types/renovation';
import { useRenovationStore } from '@/stores/renovation-store';
import { formatCurrency, formatPercentage } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { AddRenovationDialog } from '@/components/renovations/add-renovation-dialog';
import { RenovationItem } from '@/components/renovations/renovation-item';

export function RenovationsSection() {
  const { renovations, addRenovation, updateRenovation, removeRenovation } =
    useRenovationStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRenovation, setEditingRenovation] = useState<
    Renovation | undefined
  >(undefined);

  function handleAdd() {
    setEditingRenovation(undefined);
    setDialogOpen(true);
  }

  function handleEdit(renovation: Renovation) {
    setEditingRenovation(renovation);
    setDialogOpen(true);
  }

  function handleSave(renovation: Renovation) {
    if (editingRenovation) {
      updateRenovation(renovation.id, renovation);
    } else {
      addRenovation(renovation);
    }
  }

  const totalCost = renovations.reduce((sum, r) => sum + r.cost, 0);
  const averageCapitalImpact =
    renovations.length > 0
      ? renovations.reduce((sum, r) => sum + r.capitalGrowthImpact, 0) /
        renovations.length
      : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Renovations</CardTitle>
          <Button size="sm" onClick={handleAdd}>
            <Plus />
            Add Renovation
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {renovations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground text-sm">
              No renovations planned yet.
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Add a renovation to see how it impacts your property's value and
              rental income.
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Capital Impact</TableHead>
                  <TableHead>Nightly Rate Impact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renovations.map((renovation) => (
                  <RenovationItem
                    key={renovation.id}
                    renovation={renovation}
                    onEdit={handleEdit}
                    onDelete={removeRenovation}
                  />
                ))}
              </TableBody>
            </Table>

            <Separator className="my-4" />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-muted-foreground">
                    Total renovation cost:{' '}
                  </span>
                  <span className="font-semibold">{formatCurrency(totalCost)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Avg. capital impact:{' '}
                  </span>
                  <span className="font-semibold">
                    {formatPercentage(averageCapitalImpact)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>

      <AddRenovationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingRenovation}
        onSave={handleSave}
      />
    </Card>
  );
}
