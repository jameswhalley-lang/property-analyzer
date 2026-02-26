import { useState } from 'react';
import { useCashflowProjectionStore } from '@/stores/cashflow-projection-store';
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

export function CashflowProjectionTable() {
  const {
    rentalGrowthRates,
    costGrowthRates,
    setRentalGrowthRate,
    setCostGrowthRate,
    setAllRentalGrowthRates,
    setAllCostGrowthRates,
    resetAll,
  } = useCashflowProjectionStore();
  const { cashflowProjections } = useCalculations();
  const [bulkRentalRate, setBulkRentalRate] = useState('');
  const [bulkCostRate, setBulkCostRate] = useState('');

  function handleSetAllRentalRates() {
    const rate = parseFloat(bulkRentalRate);
    if (!isNaN(rate)) {
      setAllRentalGrowthRates(rate);
      setBulkRentalRate('');
    }
  }

  function handleSetAllCostRates() {
    const rate = parseFloat(bulkCostRate);
    if (!isNaN(rate)) {
      setAllCostGrowthRates(rate);
      setBulkCostRate('');
    }
  }

  function handleRentalKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSetAllRentalRates();
  }

  function handleCostKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSetAllCostRates();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            step={0.1}
            value={bulkRentalRate}
            onChange={(e) => setBulkRentalRate(e.target.value)}
            onKeyDown={handleRentalKeyDown}
            placeholder="e.g. 3.0"
            className="w-24"
          />
          <Button variant="outline" size="sm" onClick={handleSetAllRentalRates}>
            Set rental growth
          </Button>
        </div>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2">
          <Input
            type="number"
            step={0.1}
            value={bulkCostRate}
            onChange={(e) => setBulkCostRate(e.target.value)}
            onKeyDown={handleCostKeyDown}
            placeholder="e.g. 2.5"
            className="w-24"
          />
          <Button variant="outline" size="sm" onClick={handleSetAllCostRates}>
            Set cost growth
          </Button>
        </div>
        <Separator orientation="vertical" className="h-6" />
        <Button variant="ghost" size="sm" onClick={resetAll}>
          Reset
        </Button>
      </div>

      <div className="overflow-auto rounded-md border" style={{ maxHeight: '540px' }}>
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="w-16">Year</TableHead>
              <TableHead className="w-28">Rental Growth %</TableHead>
              <TableHead className="w-28">Cost Growth %</TableHead>
              <TableHead className="text-right">Net Income</TableHead>
              <TableHead className="text-right">Total Costs</TableHead>
              <TableHead className="text-right">Annual Cashflow</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cashflowProjections.slice(1).map((projection, index) => (
              <TableRow key={projection.year}>
                <TableCell className="font-medium tabular-nums">
                  {projection.year}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step={0.1}
                    value={rentalGrowthRates[index]}
                    onChange={(e) =>
                      setRentalGrowthRate(index, parseFloat(e.target.value) || 0)
                    }
                    className="h-7 w-20 tabular-nums"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step={0.1}
                    value={costGrowthRates[index]}
                    onChange={(e) =>
                      setCostGrowthRate(index, parseFloat(e.target.value) || 0)
                    }
                    className="h-7 w-20 tabular-nums"
                  />
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(projection.netRentalIncome)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(projection.totalCosts)}
                </TableCell>
                <TableCell
                  className={`text-right tabular-nums font-medium ${
                    projection.annualCashflow >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(projection.annualCashflow)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
