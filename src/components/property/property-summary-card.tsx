import { usePropertyStore } from '@/stores/property-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/format';

export function PropertySummaryCard() {
  const {
    address,
    purchasePrice,
    lastSalePrice,
    lastSaleDate,
    suburbMedianPrice,
    suburbGrowthRate,
  } = usePropertyStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="text-sm font-medium">
              {address || 'Not specified'}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Purchase Price</p>
            <p className="text-sm font-medium">
              {purchasePrice > 0 ? formatCurrency(purchasePrice) : 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Last Sale</p>
            <p className="text-sm font-medium">
              {lastSalePrice != null
                ? `${formatCurrency(lastSalePrice)}${lastSaleDate ? ` (${lastSaleDate})` : ''}`
                : 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Suburb Median Price</p>
            <p className="text-sm font-medium">
              {suburbMedianPrice != null
                ? formatCurrency(suburbMedianPrice)
                : 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Suburb Growth Rate</p>
            <p className="text-sm font-medium">
              {suburbGrowthRate != null
                ? formatPercentage(suburbGrowthRate)
                : 'N/A'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
