import { useFinancialStore } from '@/stores/financial-store';
import { useCashflowProjectionStore } from '@/stores/cashflow-projection-store';
import { useCalculations } from '@/hooks/use-calculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CurrencyInput } from '@/components/shared/currency-input';
import { PercentageInput } from '@/components/shared/percentage-input';
import { formatCurrency } from '@/lib/format';
import { computeCAGR } from '@/lib/calculations/cashflow';

export function IncomeSection() {
  const { income, setIncome } = useFinancialStore();
  const { rentalGrowthRates, setAllRentalGrowthRates } = useCashflowProjectionStore();
  const calc = useCalculations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rental Income</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CurrencyInput
          label="Nightly Rate"
          value={income.nightlyRate}
          onChange={(value) => setIncome({ nightlyRate: value })}
          min={0}
          step={10}
        />

        <PercentageInput
          label="Occupancy Rate"
          value={income.occupancyRate}
          onChange={(value) => setIncome({ occupancyRate: value })}
          min={0}
          max={100}
          step={1}
          decimals={0}
        />

        <PercentageInput
          label="Airbnb Host Fee"
          value={income.airbnbHostFee}
          onChange={(value) => setIncome({ airbnbHostFee: value })}
          min={0}
          max={20}
          step={0.5}
          decimals={1}
        />

        <CurrencyInput
          label="Cleaning Fee per Visit"
          value={income.cleaningFeePerVisit}
          onChange={(value) => setIncome({ cleaningFeePerVisit: value })}
          min={0}
          step={10}
        />

        <PercentageInput
          label="Management Fee"
          value={income.managementFee}
          onChange={(value) => setIncome({ managementFee: value })}
          min={0}
          max={30}
          step={0.5}
          decimals={1}
        />

        <PercentageInput
          label="Rental Income Growth (CAGR)"
          value={Math.round(computeCAGR(rentalGrowthRates) * 100) / 100}
          onChange={(value) => setAllRentalGrowthRates(value)}
          min={-10}
          max={20}
          step={0.1}
          decimals={2}
        />

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Calculated</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <span className="text-muted-foreground">Annual Bookings</span>
            <span className="text-right font-medium">
              {calc.rentalIncome.annualBookings} nights
            </span>

            <span className="text-muted-foreground">Gross Income</span>
            <span className="text-right font-medium">
              {formatCurrency(calc.rentalIncome.grossIncome)}
            </span>

            <span className="text-muted-foreground">Airbnb Fees</span>
            <span className="text-right font-medium text-destructive">
              -{formatCurrency(calc.rentalIncome.airbnbFees)}
            </span>

            <span className="text-muted-foreground">Cleaning Costs</span>
            <span className="text-right font-medium text-destructive">
              -{formatCurrency(calc.rentalIncome.annualCleaning)}
            </span>

            <span className="text-muted-foreground">Management Fees</span>
            <span className="text-right font-medium text-destructive">
              -{formatCurrency(calc.rentalIncome.managementFees)}
            </span>

            <Separator className="col-span-2" />

            <span className="font-semibold">Net Income</span>
            <span className="text-right font-semibold">
              {formatCurrency(calc.rentalIncome.netIncome)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
