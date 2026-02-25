import { usePropertyStore } from '@/stores/property-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CurrencyInput } from '@/components/shared/currency-input';
import { STAMP_DUTY_STATES } from '@/lib/data/stamp-duty-rates';
import type { AustralianState, PropertyType } from '@/types/property';

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'unit', label: 'Unit' },
];

export function PropertyDetailsForm() {
  const {
    address,
    suburb,
    state,
    postcode,
    bedrooms,
    propertyType,
    purchasePrice,
    setProperty,
  } = usePropertyStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-muted-foreground">
            Address
          </Label>
          <Input
            type="text"
            value={address}
            onChange={(e) => setProperty({ address: e.target.value })}
            placeholder="123 Example Street"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-muted-foreground">
              Suburb
            </Label>
            <Input
              type="text"
              value={suburb}
              onChange={(e) => setProperty({ suburb: e.target.value })}
              placeholder="Suburb"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-muted-foreground">
              State
            </Label>
            <Select
              value={state}
              onValueChange={(value) =>
                setProperty({ state: value as AustralianState })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {STAMP_DUTY_STATES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-muted-foreground">
              Postcode
            </Label>
            <Input
              type="text"
              value={postcode}
              onChange={(e) => setProperty({ postcode: e.target.value })}
              placeholder="2000"
              maxLength={4}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-muted-foreground">
              Bedrooms
            </Label>
            <Input
              type="number"
              value={bedrooms}
              onChange={(e) =>
                setProperty({
                  bedrooms: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)),
                })
              }
              min={1}
              max={10}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-muted-foreground">
            Property Type
          </Label>
          <Select
            value={propertyType}
            onValueChange={(value) =>
              setProperty({ propertyType: value as PropertyType })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((pt) => (
                <SelectItem key={pt.value} value={pt.value}>
                  {pt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CurrencyInput
          label="Purchase Price"
          value={purchasePrice}
          onChange={(value) => setProperty({ purchasePrice: value })}
          min={0}
          step={10000}
        />
      </CardContent>
    </Card>
  );
}
