import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useCalculations } from '@/hooks/use-calculations';
import { formatCurrency } from '@/lib/format';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: number;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const propertyValue = payload.find((p) => p.name === 'Property Value')?.value ?? 0;
  const loanBalance = payload.find((p) => p.name === 'Loan Balance')?.value ?? 0;
  const equity = propertyValue - loanBalance;

  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      <p className="mb-2 text-sm font-semibold">Year {label}</p>
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">Property Value:</span>
          <span className="ml-auto font-medium">{formatCurrency(propertyValue)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-red-500" />
          <span className="text-muted-foreground">Loan Balance:</span>
          <span className="ml-auto font-medium">{formatCurrency(loanBalance)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Equity:</span>
          <span className="ml-auto font-medium">{formatCurrency(equity)}</span>
        </div>
      </div>
    </div>
  );
}

export function GrowthChart() {
  const { projections } = useCalculations();

  const chartData = projections.map((p) => ({
    year: p.year,
    'Property Value': p.propertyValue,
    'Loan Balance': p.loanBalance,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          label={{ value: 'Year', position: 'insideBottom', offset: -5, fontSize: 12 }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => formatCurrency(value)}
          width={100}
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => (
            <span className="text-sm text-foreground">{value}</span>
          )}
        />
        <Area
          type="monotone"
          dataKey="Property Value"
          fill="hsl(221.2 83.2% 53.3%)"
          fillOpacity={0.15}
          stroke="hsl(221.2 83.2% 53.3%)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="Loan Balance"
          fill="hsl(0 84.2% 60.2%)"
          fillOpacity={0.1}
          stroke="hsl(0 84.2% 60.2%)"
          strokeWidth={2}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
