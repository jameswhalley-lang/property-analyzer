import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GrowthSummaryCard } from './growth-summary-card';
import { GrowthChart } from './growth-chart';
import { GrowthRateTable } from './growth-rate-table';

export function CapitalGrowthView() {
  return (
    <div className="space-y-6">
      <GrowthSummaryCard />

      <Card>
        <CardHeader>
          <CardTitle>30-Year Growth Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <GrowthChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Annual Growth Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <GrowthRateTable />
        </CardContent>
      </Card>
    </div>
  );
}
