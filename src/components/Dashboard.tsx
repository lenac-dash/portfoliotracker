import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { formatCurrency, formatPercent, calculateTotalPortfolioValue } from '../utils/calculations';
import { RefreshCw, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import clsx from 'clsx';

// Tab components (to be created)
import OverviewTab from './tabs/OverviewTab';
import RebalancingTab from './tabs/RebalancingTab';
import AnalyticsTab from './tabs/AnalyticsTab';

type TabType = 'overview' | 'rebalancing' | 'analytics';

const Dashboard: React.FC = () => {
  const { state, refreshPortfolio } = usePortfolio();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const { portfolio, lastUpdated } = state;
  const currentValue = calculateTotalPortfolioValue(portfolio.stocks);
  const totalValue = currentValue + portfolio.additionalCapital;
  
  // Mock P&L calculation (in a real app, this would be based on historical data)
  const dayChange = currentValue * 0.015; // Mock 1.5% daily change
  const dayChangePercent = (dayChange / currentValue) * 100;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'rebalancing', label: 'Rebalancing', icon: RefreshCw },
    { id: 'analytics', label: 'Analytics', icon: TrendingDown },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'rebalancing':
        return <RebalancingTab />;
      case 'analytics':
        return <AnalyticsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Portfolio Manager</h1>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Last updated: {lastUpdated.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Day Change</p>
                <p className={clsx(
                  'text-lg font-semibold',
                  dayChange >= 0 ? 'text-success-600' : 'text-danger-600'
                )}>
                  {dayChange >= 0 ? '+' : ''}{formatCurrency(dayChange)} ({formatPercent(dayChangePercent)})
                </p>
              </div>
              <button
                onClick={refreshPortfolio}
                className="btn btn-primary flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-body">
              <h3 className="text-sm font-medium text-gray-600">Current Value</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentValue)}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 className="text-sm font-medium text-gray-600">Additional Capital</h3>
              <p className="text-2xl font-bold text-primary-600">{formatCurrency(portfolio.additionalCapital)}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 className="text-sm font-medium text-gray-600">Total Value</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 className="text-sm font-medium text-gray-600">Target Allocation</h3>
              <p className="text-2xl font-bold text-success-600">
                {formatPercent(portfolio.stocks.reduce((sum, stock) => sum + stock.targetPercent, 0))}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={clsx(
                    'flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;