import { useCalculations } from '@/hooks/use-calculations';
import { formatCurrency } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';

interface SummaryItemProps {
  label: string;
  value: number;
  variant?: 'default' | 'highlight';
}

function SummaryItem({ label, value, variant = 'default' }: SummaryItemProps) {
  return (
    <Card className={variant === 'highlight' ? 'border-primary/30 bg-primary/5' : ''}>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold tabular-nums tracking-tight">
          {formatCurrency(value)}
        </p>
      </CardContent>
    </Card>
  );
}

export function GrowthSummaryCard() {
  const { growthSummary } = useCalculations();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <SummaryItem label="Value at Year 10" value={growthSummary.valueYear10} />
        <SummaryItem label="Value at Year 20" value={growthSummary.valueYear20} />
        <SummaryItem label="Value at Year 30" value={growthSummary.valueYear30} />
        <SummaryItem label="Equity at Year 10" value={growthSummary.equityYear10} />
        <SummaryItem label="Equity at Year 20" value={growthSummary.equityYear20} />
        <SummaryItem label="Equity at Year 30" value={growthSummary.equityYear30} />
        <SummaryItem
          label="Total Rental Income (30yr)"
          value={growthSummary.totalRentalIncome30Years}
        />
        <SummaryItem
          label="Total Return"
          value={growthSummary.totalReturn}
          variant="highlight"
        />
      </div>
    </div>
  );
}
