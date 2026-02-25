import { PropertyDetailsForm } from '@/components/property/property-details-form';
import { MortgageSection } from '@/components/financials/mortgage-section';
import { IncomeSection } from '@/components/financials/income-section';
import { CostsSection } from '@/components/financials/costs-section';

export function FinancialBreakdownView() {
  return (
    <div className="space-y-6 pb-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <PropertyDetailsForm />
          <MortgageSection />
        </div>
        <div className="space-y-6">
          <IncomeSection />
          <CostsSection />
        </div>
      </div>
    </div>
  );
}
