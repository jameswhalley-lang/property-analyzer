import { CashflowSummaryCards } from './cashflow-summary-cards';
import { CashflowBreakdownTable } from './cashflow-breakdown-table';
import { CashflowProjectionTable } from './cashflow-projection-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CashflowView() {
  return (
    <div className="space-y-6">
      <CashflowSummaryCards />
      <CashflowBreakdownTable />
      <Card>
        <CardHeader>
          <CardTitle>30-Year Cashflow Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <CashflowProjectionTable />
        </CardContent>
      </Card>
    </div>
  );
}
