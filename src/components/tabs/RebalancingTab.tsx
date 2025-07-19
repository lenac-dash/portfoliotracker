import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  calculateCurrentValue,
  calculateCurrentPercent,
  calculateTargetValue,
  calculateRebalanceAmount,
  calculateUnitsNeeded,
  calculateTotalPortfolioValue,
  generateTradeRecommendations,
  formatCurrency,
  formatPercent,
  formatNumber
} from '../../utils/calculations';
import { Edit3, Save, X, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Target } from 'lucide-react';
import clsx from 'clsx';

const RebalancingTab: React.FC = () => {
  const { state, updateStockPrice, updateStockUnits, updateTargetAllocation, updateAdditionalCapital } = usePortfolio();
  const { portfolio } = state;
  
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [editingCapital, setEditingCapital] = useState(false);
  const [tempValues, setTempValues] = useState<{ [key: string]: number }>({});

  const totalValue = calculateTotalPortfolioValue(portfolio.stocks) + portfolio.additionalCapital;
  const recommendations = generateTradeRecommendations(portfolio);

  const handleEdit = (symbol: string, field: string, currentValue: number) => {
    setEditingStock(`${symbol}-${field}`);
    setTempValues({ [`${symbol}-${field}`]: currentValue });
  };

  const handleSave = (symbol: string, field: string) => {
    const key = `${symbol}-${field}`;
    const value = tempValues[key];
    
    if (value !== undefined) {
      switch (field) {
        case 'price':
          updateStockPrice(symbol, value);
          break;
        case 'units':
          updateStockUnits(symbol, value);
          break;
        case 'target':
          updateTargetAllocation(symbol, value);
          break;
      }
    }
    
    setEditingStock(null);
    setTempValues({});
  };

  const handleCancel = () => {
    setEditingStock(null);
    setTempValues({});
  };

  const handleCapitalSave = () => {
    const value = tempValues['capital'];
    if (value !== undefined) {
      updateAdditionalCapital(value);
    }
    setEditingCapital(false);
    setTempValues({});
  };

  const EditableCell = ({ 
    value, 
    symbol, 
    field, 
    formatter = (v: number) => v.toString(),
    className = ""
  }: {
    value: number;
    symbol: string;
    field: string;
    formatter?: (value: number) => string;
    className?: string;
  }) => {
    const isEditing = editingStock === `${symbol}-${field}`;
    const tempValue = tempValues[`${symbol}-${field}`];

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={tempValue ?? value}
            onChange={(e) => setTempValues({ ...tempValues, [`${symbol}-${field}`]: parseFloat(e.target.value) || 0 })}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
            step={field === 'price' ? '0.01' : field === 'target' ? '0.1' : '1'}
            autoFocus
          />
          <button
            onClick={() => handleSave(symbol, field)}
            className="p-1 text-success-600 hover:text-success-700"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-danger-600 hover:text-danger-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div className={clsx("flex items-center gap-2 group", className)}>
        <span>{formatter(value)}</span>
        <button
          onClick={() => handleEdit(symbol, field, value)}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-opacity"
        >
          <Edit3 className="w-3 h-3" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Additional Capital Input */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Additional Capital</h3>
            <div className="flex items-center gap-4">
              <DollarSign className="w-5 h-5 text-primary-600" />
              {editingCapital ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tempValues['capital'] ?? portfolio.additionalCapital}
                    onChange={(e) => setTempValues({ ...tempValues, capital: parseFloat(e.target.value) || 0 })}
                    className="w-32 px-3 py-1 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                    step="1000"
                    autoFocus
                  />
                  <button
                    onClick={handleCapitalSave}
                    className="btn btn-success"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingCapital(false);
                      setTempValues({});
                    }}
                    className="btn btn-secondary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary-600">
                    {formatCurrency(portfolio.additionalCapital)}
                  </span>
                  <button
                    onClick={() => setEditingCapital(true)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="card-body">
          <p className="text-sm text-gray-600">
            This capital will be used for rebalancing your portfolio. Total available: {formatCurrency(totalValue)}
          </p>
        </div>
      </div>

      {/* Interactive Portfolio Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Portfolio Rebalancing Calculator</h3>
        </div>
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current %</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Target %</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Target Value</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rebalance Amount</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Units Needed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {portfolio.stocks.map((stock) => {
                  const currentValue = calculateCurrentValue(stock);
                  const currentPercent = calculateCurrentPercent(stock, totalValue);
                  const targetValue = calculateTargetValue(stock, totalValue);
                  const rebalanceAmount = calculateRebalanceAmount(stock, totalValue);
                  const unitsNeeded = calculateUnitsNeeded(stock, totalValue);
                  
                  const isOverweight = rebalanceAmount < -1000;
                  const isUnderweight = rebalanceAmount > 1000;

                  return (
                    <tr key={stock.symbol} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                          <div className="text-sm text-gray-500">{stock.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <EditableCell
                          value={stock.currentPrice}
                          symbol={stock.symbol}
                          field="price"
                          formatter={formatCurrency}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <EditableCell
                          value={stock.currentUnits}
                          symbol={stock.symbol}
                          field="units"
                          formatter={(v) => formatNumber(v)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(currentValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatPercent(currentPercent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <EditableCell
                          value={stock.targetPercent}
                          symbol={stock.symbol}
                          field="target"
                          formatter={(v) => formatPercent(v)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(targetValue)}
                      </td>
                      <td className={clsx(
                        "px-6 py-4 whitespace-nowrap text-right text-sm font-medium",
                        isOverweight ? 'text-danger-600' : isUnderweight ? 'text-success-600' : 'text-gray-900'
                      )}>
                        <div className="flex items-center justify-end gap-1">
                          {isOverweight && <TrendingDown className="w-4 h-4" />}
                          {isUnderweight && <TrendingUp className="w-4 h-4" />}
                          {rebalanceAmount >= 0 ? '+' : ''}{formatCurrency(rebalanceAmount)}
                        </div>
                      </td>
                      <td className={clsx(
                        "px-6 py-4 whitespace-nowrap text-right text-sm font-medium",
                        isOverweight ? 'text-danger-600' : isUnderweight ? 'text-success-600' : 'text-gray-900'
                      )}>
                        {unitsNeeded >= 0 ? '+' : ''}{formatNumber(unitsNeeded)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trade Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Trade Recommendations</h3>
          </div>
          <div className="card-body">
            {recommendations.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Portfolio is well balanced!</p>
                <p className="text-sm text-gray-400">No significant rebalancing needed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.symbol} className={clsx(
                    "p-4 rounded-lg border",
                    rec.priority === 'HIGH' ? 'border-danger-200 bg-danger-50' :
                    rec.priority === 'MEDIUM' ? 'border-yellow-200 bg-yellow-50' :
                    'border-gray-200 bg-gray-50'
                  )}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={clsx(
                          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                          rec.action === 'BUY' ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'
                        )}>
                          {rec.action === 'BUY' ? '+' : '-'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{rec.action} {rec.symbol}</h4>
                            <span className={clsx(
                              "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                              rec.priority === 'HIGH' ? 'bg-danger-100 text-danger-800' :
                              rec.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            )}>
                              {rec.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-gray-500">Units: {formatNumber(rec.units)}</span>
                            <span className="text-gray-500">Amount: {formatCurrency(rec.dollarAmount)}</span>
                          </div>
                        </div>
                      </div>
                      {rec.priority === 'HIGH' && (
                        <AlertTriangle className="w-5 h-5 text-danger-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rebalancing Summary */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Rebalancing Summary</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Total Buy Orders</span>
                <span className="font-medium text-success-600">
                  {formatCurrency(recommendations.filter(r => r.action === 'BUY').reduce((sum, r) => sum + r.dollarAmount, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Total Sell Orders</span>
                <span className="font-medium text-danger-600">
                  {formatCurrency(recommendations.filter(r => r.action === 'SELL').reduce((sum, r) => sum + r.dollarAmount, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
                <span className="text-sm text-primary-700">Net Cash Flow</span>
                <span className="font-medium text-primary-800">
                  {formatCurrency(
                    recommendations.filter(r => r.action === 'SELL').reduce((sum, r) => sum + r.dollarAmount, 0) -
                    recommendations.filter(r => r.action === 'BUY').reduce((sum, r) => sum + r.dollarAmount, 0)
                  )}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full btn btn-primary">
                  Execute Rebalancing Plan
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  This will generate trade orders for your broker
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RebalancingTab;