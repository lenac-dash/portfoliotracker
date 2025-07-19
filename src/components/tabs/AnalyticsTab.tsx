import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  calculateTotalPortfolioValue,
  calculatePortfolioProjectedReturns,
  calculatePortfolioBeta,
  calculateSectorAllocations,
  formatCurrency,
  formatPercent,
  formatNumber
} from '../../utils/calculations';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Shield, Target, Activity, Zap, AlertCircle } from 'lucide-react';

const AnalyticsTab: React.FC = () => {
  const { state } = usePortfolio();
  const { portfolio } = state;

  const totalValue = calculateTotalPortfolioValue(portfolio.stocks) + portfolio.additionalCapital;
  const projectedReturns = calculatePortfolioProjectedReturns(portfolio);
  const portfolioBeta = calculatePortfolioBeta(portfolio.stocks);
  const sectorAllocations = calculateSectorAllocations(portfolio.stocks);

  // Mock historical performance data (in real app, this would come from API)
  const historicalData = [
    { month: 'Jan', portfolio: 5.2, sp500: 3.1, qqq: 4.8 },
    { month: 'Feb', portfolio: -2.1, sp500: -1.5, qqq: -2.8 },
    { month: 'Mar', portfolio: 8.7, sp500: 4.2, qqq: 6.9 },
    { month: 'Apr', portfolio: 3.4, sp500: 2.8, qqq: 3.1 },
    { month: 'May', portfolio: -1.8, sp500: -0.9, qqq: -1.2 },
    { month: 'Jun', portfolio: 12.3, sp500: 6.7, qqq: 9.4 },
  ];

  // Return projection scenarios
  const returnScenarios = [
    {
      period: '6 Month',
      conservative: projectedReturns.sixMonth.conservative,
      base: projectedReturns.sixMonth.base,
      optimistic: projectedReturns.sixMonth.optimistic,
    },
    {
      period: '12 Month',
      conservative: projectedReturns.twelveMonth.conservative,
      base: projectedReturns.twelveMonth.base,
      optimistic: projectedReturns.twelveMonth.optimistic,
    }
  ];

  // Risk metrics (mock data)
  const riskMetrics = [
    { metric: 'Portfolio Beta', value: portfolioBeta, benchmark: 1.0, status: portfolioBeta > 1.2 ? 'high' : portfolioBeta < 0.8 ? 'low' : 'medium' },
    { metric: 'Sharpe Ratio', value: 1.45, benchmark: 1.0, status: 'high' },
    { metric: 'Max Drawdown', value: -8.2, benchmark: -10.0, status: 'medium' },
    { metric: 'Volatility', value: 18.5, benchmark: 15.0, status: 'high' },
  ];

  // AI sector performance radar chart
  const aiSectorData = [
    { sector: 'AI Chips', performance: 85, allocation: 44 },
    { sector: 'Cloud', performance: 72, allocation: 19 },
    { sector: 'AI Apps', performance: 68, allocation: 7.5 },
    { sector: 'Data', performance: 78, allocation: 5 },
    { sector: 'Energy', performance: 92, allocation: 2 },
  ];

  // Correlation matrix (mock data)
  const correlationData = [
    { asset: 'NVDA', nvda: 1.00, meta: 0.65, msft: 0.72, snow: 0.58 },
    { asset: 'META', nvda: 0.65, meta: 1.00, msft: 0.68, snow: 0.52 },
    { asset: 'MSFT', nvda: 0.72, meta: 0.68, msft: 1.00, snow: 0.61 },
    { asset: 'SNOW', nvda: 0.58, meta: 0.52, msft: 0.61, snow: 1.00 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'text-danger-600 bg-danger-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-success-600 bg-success-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Activity className="w-4 h-4" />;
      case 'low': return <Shield className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Return Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              Return Projections
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-6">
              {returnScenarios.map((scenario) => (
                <div key={scenario.period}>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">{scenario.period}</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-danger-50 rounded-lg">
                      <p className="text-xs text-danger-600 font-medium">Conservative</p>
                      <p className="text-lg font-bold text-danger-700">
                        {formatCurrency(scenario.conservative)}
                      </p>
                      <p className="text-xs text-danger-600">
                        {formatPercent((scenario.conservative / totalValue) * 100)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-primary-50 rounded-lg">
                      <p className="text-xs text-primary-600 font-medium">Base Case</p>
                      <p className="text-lg font-bold text-primary-700">
                        {formatCurrency(scenario.base)}
                      </p>
                      <p className="text-xs text-primary-600">
                        {formatPercent((scenario.base / totalValue) * 100)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-success-50 rounded-lg">
                      <p className="text-xs text-success-600 font-medium">Optimistic</p>
                      <p className="text-lg font-bold text-success-700">
                        {formatCurrency(scenario.optimistic)}
                      </p>
                      <p className="text-xs text-success-600">
                        {formatPercent((scenario.optimistic / totalValue) * 100)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-600" />
              Risk Metrics
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {riskMetrics.map((metric) => (
                <div key={metric.metric} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getStatusColor(metric.status)}`}>
                      {getStatusIcon(metric.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{metric.metric}</p>
                      <p className="text-sm text-gray-500">
                        Benchmark: {typeof metric.benchmark === 'number' ? formatNumber(metric.benchmark) : metric.benchmark}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {typeof metric.value === 'number' ? formatNumber(metric.value) : metric.value}
                      {metric.metric === 'Max Drawdown' ? '%' : ''}
                      {metric.metric === 'Volatility' ? '%' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Performance */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Historical Performance vs Benchmarks</h3>
        </div>
        <div className="card-body">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Legend />
                <Line type="monotone" dataKey="portfolio" stroke="#3b82f6" strokeWidth={3} name="AI Portfolio" />
                <Line type="monotone" dataKey="sp500" stroke="#6b7280" strokeWidth={2} name="S&P 500" />
                <Line type="monotone" dataKey="qqq" stroke="#10b981" strokeWidth={2} name="QQQ" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Sector Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-600" />
              AI Sector Performance
            </h3>
          </div>
          <div className="card-body">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={aiSectorData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="sector" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Performance" dataKey="performance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Radar name="Allocation" dataKey="allocation" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Correlation Matrix */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Asset Correlation Matrix</h3>
          </div>
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">NVDA</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">META</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">MSFT</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">SNOW</th>
                  </tr>
                </thead>
                <tbody>
                  {correlationData.map((row) => (
                    <tr key={row.asset}>
                      <td className="px-3 py-2 font-medium text-gray-900">{row.asset}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`inline-block w-12 h-6 rounded text-xs font-medium text-white flex items-center justify-center`}
                              style={{ backgroundColor: `rgba(59, 130, 246, ${row.nvda})` }}>
                          {row.nvda.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`inline-block w-12 h-6 rounded text-xs font-medium text-white flex items-center justify-center`}
                              style={{ backgroundColor: `rgba(59, 130, 246, ${row.meta})` }}>
                          {row.meta.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`inline-block w-12 h-6 rounded text-xs font-medium text-white flex items-center justify-center`}
                              style={{ backgroundColor: `rgba(59, 130, 246, ${row.msft})` }}>
                          {row.msft.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`inline-block w-12 h-6 rounded text-xs font-medium text-white flex items-center justify-center`}
                              style={{ backgroundColor: `rgba(59, 130, 246, ${row.snow})` }}>
                          {row.snow.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Darker colors indicate higher correlation. Values range from -1 to 1.
            </p>
          </div>
        </div>
      </div>

      {/* AI Investment Thesis */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">AI Investment Thesis Dashboard</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500 rounded-full">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">GPU Demand</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Data Center Growth</span>
                  <span className="text-sm font-medium text-green-600">+127% YoY</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">AI Training Workloads</span>
                  <span className="text-sm font-medium text-green-600">+89% YoY</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Supply Constraints</span>
                  <span className="text-sm font-medium text-yellow-600">High</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-500 rounded-full">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Cloud Infrastructure</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">AI Services Revenue</span>
                  <span className="text-sm font-medium text-green-600">+156% YoY</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Enterprise Adoption</span>
                  <span className="text-sm font-medium text-green-600">+78% YoY</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Market Share</span>
                  <span className="text-sm font-medium text-blue-600">Expanding</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-500 rounded-full">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Energy Infrastructure</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nuclear Power Demand</span>
                  <span className="text-sm font-medium text-green-600">+45% YoY</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Data Center Power</span>
                  <span className="text-sm font-medium text-green-600">+67% YoY</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Grid Stability</span>
                  <span className="text-sm font-medium text-green-600">Critical</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;