import { useCalculations } from '@/hooks/use-calculations';
import { formatCurrency, formatPercentage } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CashflowSummaryCards() {
  const { cashflow } = useCalculations();

  const cards = [
    {
      title: 'Gross Yield',
      value: formatPercentage(cashflow.grossYield, 1),
      colorClass: undefined,
    },
    {
      title: 'Net Yield',
      value: formatPercentage(cashflow.netYield, 1),
      colorClass: undefined,
    },
    {
      title: 'Monthly Cashflow',
      value: formatCurrency(cashflow.monthlyCashflow),
      colorClass: cashflow.monthlyCashflow >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: 'Annual Cashflow',
      value: formatCurrency(cashflow.annualCashflow),
      colorClass: cashflow.annualCashflow >= 0 ? 'text-green-600' : 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn('text-2xl font-bold', card.colorClass)}>
              {card.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
