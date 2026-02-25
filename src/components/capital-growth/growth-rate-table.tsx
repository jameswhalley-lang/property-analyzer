import { useState } from 'react';
import { useCapitalGrowthStore } from '@/stores/capital-growth-store';
import { useCalculations } from '@/hooks/use-calculations';
import { formatCurrency } from '@/lib/format';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function GrowthRateTable() {
  const { growthRates, setGrowthRate, setAllRates, resetRates } =
    useCapitalGrowthStore();
  const { projections } = useCalculations();
  const [bulkRate, setBulkRate] = useState('');

  function handleSetAllRates() {
    const rate = parseFloat(bulkRate);
    if (!isNaN(rate)) {
      setAllRates(rate);
      setBulkRate('');
    }
  }

  function handleBulkRateKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSetAllRates();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            step={0.1}
            value={bulkRate}
            onChange={(e) => setBulkRate(e.target.value)}
            onKeyDown={handleBulkRateKeyDown}
            placeholder="e.g. 5.0"
            className="w-24"
          />
          <Button variant="outline" size="sm" onClick={handleSetAllRates}>
            Set all rates
          </Button>
        </div>
        <Separator orientation="vertical" className="h-6" />
        <Button variant="ghost" size="sm" onClick={resetRates}>
          Reset all rates
        </Button>
      </div>

      <div className="overflow-auto rounded-md border" style={{ maxHeight: '540px' }}>
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="w-16">Year</TableHead>
              <TableHead className="w-28">Growth Rate %</TableHead>
              <TableHead className="text-right">Property Value</TableHead>
              <TableHead className="text-right">Loan Balance</TableHead>
              <TableHead className="text-right">Equity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projections.slice(1).map((projection, index) => (
              <TableRow key={projection.year}>
                <TableCell className="font-medium tabular-nums">
                  {projection.year}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step={0.1}
                    value={growthRates[index]}
                    onChange={(e) =>
                      setGrowthRate(index, parseFloat(e.target.value) || 0)
                    }
                    className="h-7 w-20 tabular-nums"
                  />
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(projection.propertyValue)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(projection.loanBalance)}
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">
                  {formatCurrency(projection.equity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
