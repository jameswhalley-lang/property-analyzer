import { useCallback, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export function CurrencyInput({
  label,
  value,
  onChange,
  className,
  min,
  max,
  step = 100,
  disabled = false,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(formatDisplay(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatDisplay(value));
    }
  }, [value, isFocused]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setDisplayValue(value === 0 ? '' : value.toString());
  }, [value]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    const parsed = parseFloat(displayValue.replace(/[^0-9.-]/g, '')) || 0;
    const clamped = clamp(parsed, min, max);
    onChange(clamped);
    setDisplayValue(formatDisplay(clamped));
  }, [displayValue, onChange, min, max]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
  }, []);

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          $
        </span>
        <Input
          type={isFocused ? 'number' : 'text'}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="pl-7"
          step={step}
          min={min}
          max={max}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

function formatDisplay(value: number): string {
  if (value === 0) return '0';
  return new Intl.NumberFormat('en-AU').format(value);
}

function clamp(value: number, min?: number, max?: number): number {
  if (min !== undefined && value < min) return min;
  if (max !== undefined && value > max) return max;
  return value;
}
