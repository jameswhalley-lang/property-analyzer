import { useState } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { TabNavigation } from '@/components/layout/tab-navigation';
import { FinancialBreakdownView } from '@/components/financials/financial-breakdown-view';
import { CashflowView } from '@/components/cashflow/cashflow-view';
import { CapitalGrowthView } from '@/components/capital-growth/capital-growth-view';
import { RenovationsSection } from '@/components/renovations/renovations-section';
import { SavedPropertiesView } from '@/components/saved/saved-properties-view';

function App() {
  const [activeTab, setActiveTab] = useState('financials');

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onNewAnalysis={() => setActiveTab('financials')} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <TabNavigation value={activeTab} onValueChange={setActiveTab} />

          {activeTab === 'financials' && <FinancialBreakdownView />}
          {activeTab === 'cashflow' && <CashflowView />}
          {activeTab === 'capital-growth' && <CapitalGrowthView />}
          {activeTab === 'renovations' && <RenovationsSection />}
          {activeTab === 'saved' && (
            <SavedPropertiesView onLoaded={() => setActiveTab('financials')} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
