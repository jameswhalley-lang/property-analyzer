import { useCallback, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PercentageInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
  disabled?: boolean;
}

export function PercentageInput({
  label,
  value,
  onChange,
  className,
  min = 0,
  max = 100,
  step = 0.1,
  decimals = 1,
  disabled = false,
}: PercentageInputProps) {
  const [displayValue, setDisplayValue] = useState(value.toFixed(decimals));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value.toFixed(decimals));
    }
  }, [value, isFocused, decimals]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    const parsed = parseFloat(displayValue) || 0;
    const clamped = Math.min(max, Math.max(min, parsed));
    onChange(clamped);
    setDisplayValue(clamped.toFixed(decimals));
  }, [displayValue, onChange, min, max, decimals]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
  }, []);

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
      <div className="relative">
        <Input
          type="number"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="pr-8"
          step={step}
          min={min}
          max={max}
          disabled={disabled}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          %
        </span>
      </div>
    </div>
  );
}
