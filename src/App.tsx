import React, { useState } from 'react';
import { INITIAL_PORTFOLIO } from './data/initialPortfolio';
import { calculateTotalPortfolioValue, formatCurrency, formatPercent } from './utils/calculations';
import './App.css';

function App() {
  const [portfolio] = useState(INITIAL_PORTFOLIO);
  const currentValue = calculateTotalPortfolioValue(portfolio.stocks);
  const totalValue = currentValue + portfolio.additionalCapital;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Portfolio Manager</h1>
              <p className="text-gray-600">Professional-grade portfolio rebalancing and investment strategy</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Portfolio Value</p>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Current Holdings</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentValue)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Available Capital</h3>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(portfolio.additionalCapital)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Value</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Holdings Count</h3>
            <p className="text-2xl font-bold text-green-600">{portfolio.stocks.filter(s => s.currentUnits > 0).length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Portfolio Holdings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Target %</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {portfolio.stocks.map((stock) => {
                  const currentValue = stock.currentUnits * stock.currentPrice;
                  const currentPercent = (currentValue / totalValue) * 100;
                  
                  return (
                    <tr key={stock.symbol} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                          <div className="text-sm text-gray-500">{stock.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(stock.currentPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {stock.currentUnits.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(currentValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatPercent(stock.targetPercent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          stock.analystRating === 'BUY' ? 'bg-green-100 text-green-800' :
                          stock.analystRating === 'HOLD' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
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

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">🚀 AI Portfolio Rebalancer</h3>
          <p className="text-blue-800 mb-4">
            This is a comprehensive portfolio management application focused on AI investments. 
            The application includes real-time calculations, interactive rebalancing tools, and advanced analytics.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{portfolio.stocks.length}</div>
              <div className="text-sm text-blue-700">AI Stocks Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatPercent(portfolio.stocks.reduce((sum, s) => sum + s.targetPercent, 0))}
              </div>
              <div className="text-sm text-green-700">Target Allocation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {portfolio.stocks.filter(s => s.sector === 'AI_CHIPS' || s.sector === 'CLOUD' || s.sector === 'AI_APPS').length}
              </div>
              <div className="text-sm text-purple-700">Core AI Holdings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;