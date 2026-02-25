import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, BarChart3, TrendingUp, Hammer, FolderOpen } from 'lucide-react';

interface TabNavigationProps {
  value: string;
  onValueChange: (value: string) => void;
}

const tabs = [
  { value: 'financials', label: 'Financial Breakdown', icon: Calculator },
  { value: 'cashflow', label: 'Cashflow', icon: BarChart3 },
  { value: 'capital-growth', label: 'Capital Growth', icon: TrendingUp },
  { value: 'renovations', label: 'Renovations', icon: Hammer },
  { value: 'saved', label: 'Saved', icon: FolderOpen },
] as const;

export function TabNavigation({ value, onValueChange }: TabNavigationProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList className="grid w-full grid-cols-5">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 text-xs sm:text-sm">
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
