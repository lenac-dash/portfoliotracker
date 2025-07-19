import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  calculateCurrentValue, 
  calculateCurrentPercent, 
  calculateTotalPortfolioValue,
  calculateSectorAllocations,
  formatCurrency,
  formatPercent,
  formatNumber
} from '../../utils/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import clsx from 'clsx';

const COLORS = {
  AI_CHIPS: '#3b82f6',
  CLOUD: '#10b981',
  AI_APPS: '#8b5cf6',
  DATA: '#f59e0b',
  ENERGY: '#ef4444',
  CASH: '#6b7280'
};

const SECTOR_NAMES = {
  AI_CHIPS: 'AI Chips',
  CLOUD: 'Cloud',
  AI_APPS: 'AI Apps',
  DATA: 'Data',
  ENERGY: 'Energy',
  CASH: 'Cash'
};

const OverviewTab: React.FC = () => {
  const { state } = usePortfolio();
  const { portfolio } = state;

  const totalValue = calculateTotalPortfolioValue(portfolio.stocks) + portfolio.additionalCapital;
  const sectorAllocations = calculateSectorAllocations(portfolio.stocks);

  // Prepare data for pie chart
  const pieData = portfolio.stocks
    .filter(stock => calculateCurrentValue(stock) > 0)
    .map(stock => ({
      name: stock.symbol,
      value: calculateCurrentValue(stock),
      percent: calculateCurrentPercent(stock, totalValue),
      sector: stock.sector
    }));

  // Prepare data for sector bar chart
  const sectorData = sectorAllocations.map(allocation => ({
    sector: SECTOR_NAMES[allocation.sector],
    current: allocation.currentPercent,
    target: allocation.targetPercent,
    value: allocation.currentValue
  }));

  // Top performers (mock data - in real app would be based on historical performance)
  const topPerformers = portfolio.stocks
    .filter(stock => calculateCurrentValue(stock) > 0)
    .map(stock => ({
      ...stock,
      mockReturn: Math.random() * 20 - 10, // Mock return between -10% and +10%
      currentValue: calculateCurrentValue(stock)
    }))
    .sort((a, b) => b.mockReturn - a.mockReturn)
    .slice(0, 5);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{`${label}`}</p>
          <p className="text-primary-600">{`Current: ${formatPercent(payload[0].value)}`}</p>
          <p className="text-gray-600">{`Target: ${formatPercent(payload[1].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Portfolio Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Portfolio Composition</h3>
          </div>
          <div className="card-body">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.sector]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sector Allocation */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Sector Allocation vs Target</h3>
          </div>
          <div className="card-body">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="current" fill="#3b82f6" name="Current %" />
                  <Bar dataKey="target" fill="#10b981" name="Target %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Holdings Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Portfolio Holdings</h3>
        </div>
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sector</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current %</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Target %</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {portfolio.stocks.map((stock) => {
                  const currentValue = calculateCurrentValue(stock);
                  const currentPercent = calculateCurrentPercent(stock, totalValue);
                  const isOverweight = currentPercent > stock.targetPercent + 0.5;
                  const isUnderweight = currentPercent < stock.targetPercent - 0.5;

                  return (
                    <tr key={stock.symbol} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                          <div className="text-sm text-gray-500">{stock.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              style={{ backgroundColor: `${COLORS[stock.sector]}20`, color: COLORS[stock.sector] }}>
                          {SECTOR_NAMES[stock.sector]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(stock.currentPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatNumber(stock.currentUnits)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(currentValue)}
                      </td>
                      <td className={clsx(
                        "px-6 py-4 whitespace-nowrap text-right text-sm font-medium",
                        isOverweight ? 'text-danger-600' : isUnderweight ? 'text-primary-600' : 'text-gray-900'
                      )}>
                        {formatPercent(currentPercent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatPercent(stock.targetPercent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={clsx(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          stock.analystRating === 'BUY' ? 'bg-success-100 text-success-800' :
                          stock.analystRating === 'HOLD' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-danger-100 text-danger-800'
                        )}>
                          {stock.analystRating}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Top Performers (Mock Data)</h3>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {topPerformers.map((stock, index) => (
              <div key={stock.symbol} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                    <span className="text-sm font-medium text-primary-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{stock.symbol}</p>
                    <p className="text-sm text-gray-500">{stock.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{formatCurrency(stock.currentValue)}</p>
                    <p className="text-xs text-gray-500">Value</p>
                  </div>
                  <div className={clsx(
                    'flex items-center gap-1',
                    stock.mockReturn >= 0 ? 'text-success-600' : 'text-danger-600'
                  )}>
                    {stock.mockReturn >= 0 ? 
                      <TrendingUp className="w-4 h-4" /> : 
                      <TrendingDown className="w-4 h-4" />
                    }
                    <span className="font-medium">{formatPercent(stock.mockReturn)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;