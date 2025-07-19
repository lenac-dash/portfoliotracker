export type Sector = 'AI_CHIPS' | 'CLOUD' | 'AI_APPS' | 'DATA' | 'ENERGY' | 'CASH';
export type AnalystRating = 'BUY' | 'HOLD' | 'SELL';
export type RiskTolerance = 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
export type InvestmentHorizon = '6M' | '12M' | '24M';
export type TradeAction = 'BUY' | 'SELL';
export type TradePriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Stock {
  symbol: string;
  name: string;
  sector: Sector;
  currentPrice: number;
  currentUnits: number;
  targetPercent: number;
  priceTarget6M: number;
  priceTarget12M: number;
  analystRating: AnalystRating;
  marketCap: number;
  beta: number;
  lastUpdated: Date;
}

export interface Portfolio {
  totalValue: number;
  additionalCapital: number;
  stocks: Stock[];
  riskTolerance: RiskTolerance;
  investmentHorizon: InvestmentHorizon;
  lastRebalanced: Date;
}

export interface TradeRecommendation {
  symbol: string;
  action: TradeAction;
  units: number;
  dollarAmount: number;
  priority: TradePriority;
  reason: string;
}

export interface PortfolioMetrics {
  currentValue: number;
  targetValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  dayChange: number;
  dayChangePercent: number;
  beta: number;
  sharpeRatio: number;
}

export interface SectorAllocation {
  sector: Sector;
  currentPercent: number;
  targetPercent: number;
  currentValue: number;
  targetValue: number;
}

export interface ProjectedReturns {
  sixMonth: {
    conservative: number;
    base: number;
    optimistic: number;
  };
  twelveMonth: {
    conservative: number;
    base: number;
    optimistic: number;
  };
}