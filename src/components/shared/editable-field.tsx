import { RangeIndicator } from './range-indicator';

interface EditableFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  rangeLow?: number;
  rangeHigh?: number;
  rangeLabel?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function EditableField({
  label,
  value,
  onChange,
  rangeLow,
  rangeHigh,
  rangeLabel,
  min,
  max,
  step,
  className,
}: EditableFieldProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {rangeLow !== undefined && rangeHigh !== undefined && (
          <RangeIndicator low={rangeLow} high={rangeHigh} label={rangeLabel} />
        )}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          $
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-7 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          min={min}
          max={max}
          step={step ?? 100}
        />
      </div>
    </div>
  );
}
