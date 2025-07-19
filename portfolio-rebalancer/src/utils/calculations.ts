import { Stock, Portfolio, TradeRecommendation, SectorAllocation, ProjectedReturns, Sector } from '../types/portfolio';

export const calculateCurrentValue = (stock: Stock): number => {
  return stock.currentUnits * stock.currentPrice;
};

export const calculateCurrentPercent = (stock: Stock, totalValue: number): number => {
  if (totalValue === 0) return 0;
  return (calculateCurrentValue(stock) / totalValue) * 100;
};

export const calculateTargetValue = (stock: Stock, totalValue: number): number => {
  return (totalValue * stock.targetPercent) / 100;
};

export const calculateRebalanceAmount = (stock: Stock, totalValue: number): number => {
  return calculateTargetValue(stock, totalValue) - calculateCurrentValue(stock);
};

export const calculateUnitsNeeded = (stock: Stock, totalValue: number): number => {
  const rebalanceAmount = calculateRebalanceAmount(stock, totalValue);
  if (stock.currentPrice === 0) return 0;
  return rebalanceAmount / stock.currentPrice;
};

export const calculateTotalPortfolioValue = (stocks: Stock[]): number => {
  return stocks.reduce((total, stock) => total + calculateCurrentValue(stock), 0);
};

export const calculateProjectedReturn = (stock: Stock, totalValue: number, months: 6 | 12): number => {
  const targetValue = calculateTargetValue(stock, totalValue);
  if (targetValue === 0 || stock.currentPrice === 0) return 0;
  
  const priceTarget = months === 6 ? stock.priceTarget6M : stock.priceTarget12M;
  const futureValue = (targetValue / stock.currentPrice) * priceTarget;
  return futureValue - targetValue;
};

export const calculatePortfolioProjectedReturns = (portfolio: Portfolio): ProjectedReturns => {
  const totalValue = calculateTotalPortfolioValue(portfolio.stocks) + portfolio.additionalCapital;
  
  const sixMonthBase = portfolio.stocks.reduce((total, stock) => {
    return total + calculateProjectedReturn(stock, totalValue, 6);
  }, 0);
  
  const twelveMonthBase = portfolio.stocks.reduce((total, stock) => {
    return total + calculateProjectedReturn(stock, totalValue, 12);
  }, 0);
  
  return {
    sixMonth: {
      conservative: sixMonthBase * 0.7,
      base: sixMonthBase,
      optimistic: sixMonthBase * 1.3,
    },
    twelveMonth: {
      conservative: twelveMonthBase * 0.7,
      base: twelveMonthBase,
      optimistic: twelveMonthBase * 1.3,
    },
  };
};

export const calculatePortfolioBeta = (stocks: Stock[]): number => {
  const totalValue = calculateTotalPortfolioValue(stocks);
  if (totalValue === 0) return 1;
  
  return stocks.reduce((weightedBeta, stock) => {
    const weight = calculateCurrentValue(stock) / totalValue;
    return weightedBeta + (stock.beta * weight);
  }, 0);
};

export const generateTradeRecommendations = (portfolio: Portfolio): TradeRecommendation[] => {
  const totalValue = calculateTotalPortfolioValue(portfolio.stocks) + portfolio.additionalCapital;
  const recommendations: TradeRecommendation[] = [];
  
  portfolio.stocks.forEach(stock => {
    const rebalanceAmount = calculateRebalanceAmount(stock, totalValue);
    const unitsNeeded = calculateUnitsNeeded(stock, totalValue);
    
    const imbalanceThreshold = totalValue * 0.005;
    
    if (Math.abs(rebalanceAmount) > imbalanceThreshold) {
      const action = rebalanceAmount > 0 ? 'BUY' : 'SELL';
      const priority = Math.abs(rebalanceAmount) > totalValue * 0.02 ? 'HIGH' : 
                      Math.abs(rebalanceAmount) > totalValue * 0.01 ? 'MEDIUM' : 'LOW';
      
      let reason = '';
      if (action === 'BUY') {
        reason = `Underweight by ${Math.abs(calculateCurrentPercent(stock, totalValue) - stock.targetPercent).toFixed(1)}%`;
      } else {
        reason = `Overweight by ${Math.abs(calculateCurrentPercent(stock, totalValue) - stock.targetPercent).toFixed(1)}%`;
      }
      
      recommendations.push({
        symbol: stock.symbol,
        action,
        units: Math.abs(unitsNeeded),
        dollarAmount: Math.abs(rebalanceAmount),
        priority,
        reason,
      });
    }
  });
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.dollarAmount - a.dollarAmount;
  });
};

export const calculateSectorAllocations = (stocks: Stock[]): SectorAllocation[] => {
  const totalValue = calculateTotalPortfolioValue(stocks);
  const sectorMap = new Map<Sector, SectorAllocation>();
  
  stocks.forEach(stock => {
    const currentValue = calculateCurrentValue(stock);
    const currentPercent = calculateCurrentPercent(stock, totalValue);
    
    if (sectorMap.has(stock.sector)) {
      const existing = sectorMap.get(stock.sector)!;
      existing.currentValue += currentValue;
      existing.currentPercent += currentPercent;
      existing.targetPercent += stock.targetPercent;
      existing.targetValue += calculateTargetValue(stock, totalValue);
    } else {
      sectorMap.set(stock.sector, {
        sector: stock.sector,
        currentValue,
        currentPercent,
        targetPercent: stock.targetPercent,
        targetValue: calculateTargetValue(stock, totalValue),
      });
    }
  });
  
  return Array.from(sectorMap.values());
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercent = (percent: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(percent / 100);
};

export const formatNumber = (number: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};
