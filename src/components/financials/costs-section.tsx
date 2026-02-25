import { useFinancialStore } from '@/stores/financial-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EditableField } from '@/components/shared/editable-field';
import { COST_LABELS, DEFAULT_COST_RANGES } from '@/lib/data/cost-defaults';
import { formatCurrency } from '@/lib/format';
import type { CostInputs } from '@/types/financial';

const COST_KEYS = Object.keys(COST_LABELS) as (keyof CostInputs)[];

export function CostsSection() {
  const { costs, setCost } = useFinancialStore();

  const totalAnnualCosts = COST_KEYS.reduce(
    (sum, key) => sum + (costs[key] || 0),
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Annual Costs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {COST_KEYS.map((key) => {
          const range = DEFAULT_COST_RANGES[key];
          return (
            <EditableField
              key={key}
              label={COST_LABELS[key]}
              value={costs[key]}
              onChange={(value) => setCost(key, value)}
              rangeLow={range?.low}
              rangeHigh={range?.high}
              rangeLabel="Typical range"
              min={0}
              step={100}
            />
          );
        })}

        <Separator />

        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-semibold">Total Annual Costs</span>
          <span className="text-sm font-semibold">
            {formatCurrency(totalAnnualCosts)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
