import { useFinancialStore } from '@/stores/financial-store';
import { useCalculations } from '@/hooks/use-calculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CurrencyInput } from '@/components/shared/currency-input';
import { PercentageInput } from '@/components/shared/percentage-input';
import { formatCurrency } from '@/lib/format';

export function MortgageSection() {
  const { mortgage, setMortgage } = useFinancialStore();
  const calc = useCalculations();

  const isStampDutyAuto = mortgage.stampDutyOverride === null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mortgage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PercentageInput
          label="LVR (Loan-to-Value Ratio)"
          value={mortgage.lvr}
          onChange={(value) => setMortgage({ lvr: value })}
          min={0}
          max={100}
          step={1}
          decimals={0}
        />

        <PercentageInput
          label="Interest Rate"
          value={mortgage.interestRate}
          onChange={(value) => setMortgage({ interestRate: value })}
          min={0}
          max={20}
          step={0.05}
          decimals={2}
        />

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-muted-foreground">
            Loan Term (Years)
          </Label>
          <Input
            type="number"
            value={mortgage.loanTermYears}
            onChange={(e) =>
              setMortgage({
                loanTermYears: Math.min(40, Math.max(1, parseInt(e.target.value) || 1)),
              })
            }
            min={1}
            max={40}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Stamp Duty
            </Label>
            {isStampDutyAuto && (
              <Badge variant="secondary" className="text-xs">
                Auto
              </Badge>
            )}
          </div>
          <CurrencyInput
            label=""
            value={isStampDutyAuto ? calc.stampDuty : mortgage.stampDutyOverride!}
            onChange={(value) =>
              setMortgage({ stampDutyOverride: value === 0 ? null : value })
            }
            min={0}
            step={100}
          />
          {!isStampDutyAuto && (
            <button
              type="button"
              className="text-xs text-muted-foreground underline hover:text-foreground"
              onClick={() => setMortgage({ stampDutyOverride: null })}
            >
              Reset to auto-calculated ({formatCurrency(calc.stampDuty)})
            </button>
          )}
        </div>

        <CurrencyInput
          label="Conveyancing"
          value={mortgage.conveyancing}
          onChange={(value) => setMortgage({ conveyancing: value })}
          min={0}
          step={500}
        />

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Calculated</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <span className="text-muted-foreground">Loan Amount</span>
            <span className="text-right font-medium">
              {formatCurrency(calc.mortgage.loanAmount)}
            </span>

            <span className="text-muted-foreground">Monthly Repayment</span>
            <span className="text-right font-medium">
              {formatCurrency(calc.mortgage.monthlyRepayment)}
            </span>

            <span className="text-muted-foreground">Annual Repayment</span>
            <span className="text-right font-medium">
              {formatCurrency(calc.mortgage.annualRepayment)}
            </span>

            <span className="text-muted-foreground">Deposit Required</span>
            <span className="text-right font-medium">
              {formatCurrency(calc.mortgage.depositRequired)}
            </span>

            <span className="text-muted-foreground">Total Interest</span>
            <span className="text-right font-medium">
              {formatCurrency(calc.mortgage.totalInterest)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
