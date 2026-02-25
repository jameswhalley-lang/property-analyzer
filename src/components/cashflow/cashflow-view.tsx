import { CashflowSummaryCards } from './cashflow-summary-cards';
import { CashflowBreakdownTable } from './cashflow-breakdown-table';

export function CashflowView() {
  return (
    <div className="space-y-6">
      <CashflowSummaryCards />
      <CashflowBreakdownTable />
    </div>
  );
}
