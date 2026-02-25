import { useCalculations } from '@/hooks/use-calculations';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';


interface BreakdownRow {
  label: string;
  amount: number;
  bold?: boolean;
  separatorAbove?: boolean;
  colorBySign?: boolean;
}

export function CashflowBreakdownTable() {
  const { rentalIncome, cashflow } = useCalculations();

  const rows: BreakdownRow[] = [
    {
      label: 'Gross Rental Income',
      amount: rentalIncome.grossIncome,
      bold: true,
    },
    {
      label: 'Airbnb Host Fees',
      amount: -rentalIncome.airbnbFees,
    },
    {
      label: 'Cleaning Costs',
      amount: -rentalIncome.annualCleaning,
    },
    {
      label: 'Management Fees',
      amount: -rentalIncome.managementFees,
    },
    {
      label: 'Net Rental Income',
      amount: rentalIncome.netIncome,
      bold: true,
      separatorAbove: true,
    },
    ...cashflow.costBreakdown.map((cost) => ({
      label: cost.label,
      amount: -cost.amount,
    })),
    {
      label: 'Total Annual Costs',
      amount: -cashflow.totalAnnualCosts,
      bold: true,
      separatorAbove: true,
    },
    {
      label: 'Mortgage Repayments',
      amount: -cashflow.annualMortgageRepayment,
    },
    {
      label: 'Net Annual Cashflow',
      amount: cashflow.annualCashflow,
      bold: true,
      separatorAbove: true,
      colorBySign: true,
    },
    {
      label: 'Monthly Equivalent',
      amount: cashflow.monthlyCashflow,
      colorBySign: true,
    },
    {
      label: 'Weekly Equivalent',
      amount: cashflow.weeklyCashflow,
      colorBySign: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cashflow Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.label}
                className={cn(row.separatorAbove && 'border-t-2')}
              >
                <TableCell
                  className={cn(
                    'pl-4',
                    row.bold && 'font-semibold',
                    row.colorBySign &&
                      (row.amount >= 0 ? 'text-green-600' : 'text-red-600')
                  )}
                >
                  {row.label}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right pr-4 tabular-nums',
                    row.bold && 'font-semibold',
                    row.colorBySign &&
                      (row.amount >= 0 ? 'text-green-600' : 'text-red-600')
                  )}
                >
                  {formatCurrency(row.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
