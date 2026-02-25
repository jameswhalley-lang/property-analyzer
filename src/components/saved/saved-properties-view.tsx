import { useState } from 'react';
import { Loader2, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAnalysesList, useDeleteAnalysis } from '@/hooks/use-analyses';
import { api } from '@/lib/api/client';
import { usePropertyStore } from '@/stores/property-store';
import { useFinancialStore } from '@/stores/financial-store';
import { useRenovationStore } from '@/stores/renovation-store';
import { useCapitalGrowthStore } from '@/stores/capital-growth-store';
import type { Renovation } from '@/types/renovation';

interface SavedPropertiesViewProps {
  onLoaded: () => void;
}

export function SavedPropertiesView({ onLoaded }: SavedPropertiesViewProps) {
  const { data, isLoading } = useAnalysesList();
  const deleteAnalysis = useDeleteAnalysis();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const analyses = data?.analyses ?? [];

  async function handleLoad(id: string) {
    setLoadingId(id);
    try {
      const result = await api.analyses.get(id);

      // Hydrate property store
      if (result.propertyData) {
        const pd = result.propertyData as Record<string, unknown>;
        usePropertyStore.getState().setProperty(pd);
      }

      // Hydrate financial store
      if (result.financialData) {
        const fin = result.financialData as Record<string, unknown>;
        const store = useFinancialStore.getState();
        if (fin.mortgage) store.setMortgage(fin.mortgage as Record<string, unknown>);
        if (fin.income) store.setIncome(fin.income as Record<string, unknown>);
        if (fin.costs) store.setCosts(fin.costs as Record<string, unknown>);
      }

      // Hydrate renovation store
      if (result.renovations) {
        const renStore = useRenovationStore.getState();
        renStore.clearRenovations();
        (result.renovations as Renovation[]).forEach((r) => renStore.addRenovation(r));
      }

      // Hydrate capital growth store
      if (result.growthRates) {
        const gr = result.growthRates as { growthRates: number[]; defaultRate: number };
        useCapitalGrowthStore.getState().hydrateGrowthRates(gr.growthRates, gr.defaultRate);
      }

      onLoaded();
    } catch (error) {
      console.error('Failed to load analysis:', error);
    } finally {
      setLoadingId(null);
    }
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteAnalysis.mutate(deleteId, {
      onSettled: () => setDeleteId(null),
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No saved analyses yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Use the Save button in the header to save your current analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Saved Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Date Saved</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyses.map((analysis) => (
                <TableRow key={analysis.id}>
                  <TableCell className="font-medium">{analysis.name}</TableCell>
                  <TableCell>
                    {new Date(analysis.createdAt).toLocaleDateString('en-AU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoad(analysis.id)}
                        disabled={loadingId === analysis.id}
                      >
                        {loadingId === analysis.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        <span className="ml-1.5">Load</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(analysis.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="ml-1.5">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Analysis</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this saved analysis? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteAnalysis.isPending}
            >
              {deleteAnalysis.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
