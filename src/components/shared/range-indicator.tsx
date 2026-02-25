import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/format';

interface RangeIndicatorProps {
  low: number;
  high: number;
  label?: string;
}

export function RangeIndicator({ low, high, label = 'Suburb guide' }: RangeIndicatorProps) {
  return (
    <Badge variant="secondary" className="text-xs font-normal whitespace-nowrap">
      {label}: {formatCurrency(low)} – {formatCurrency(high)}
    </Badge>
  );
}
