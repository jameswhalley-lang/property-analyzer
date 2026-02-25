import type { Renovation } from '@/types/renovation';
import { formatCurrency, formatPercentage } from '@/lib/format';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface RenovationItemProps {
  renovation: Renovation;
  onEdit: (renovation: Renovation) => void;
  onDelete: (id: string) => void;
}

export function RenovationItem({
  renovation,
  onEdit,
  onDelete,
}: RenovationItemProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{renovation.name}</TableCell>
      <TableCell>{formatCurrency(renovation.cost)}</TableCell>
      <TableCell>
        {renovation.year === 0 ? 'At purchase' : `Year ${renovation.year}`}
      </TableCell>
      <TableCell>{formatPercentage(renovation.capitalGrowthImpact)}</TableCell>
      <TableCell>{formatCurrency(renovation.nightlyRateImpact)}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onEdit(renovation)}
            aria-label={`Edit ${renovation.name}`}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(renovation.id)}
            aria-label={`Delete ${renovation.name}`}
          >
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
