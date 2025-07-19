import { Stock, Portfolio } from '../types/portfolio';

export const INITIAL_STOCKS: Stock[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'AI_CHIPS',
    currentPrice: 155,
    currentUnits: 1850.5,
    targetPercent: 40,
    priceTarget6M: 190,
    priceTarget12M: 220,
    analystRating: 'BUY',
    marketCap: 3800000000000,
    beta: 1.7,
    lastUpdated: new Date()
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc',
    sector: 'AI_APPS',
    currentPrice: 721,
    currentUnits: 73,
    targetPercent: 7.5,
    priceTarget6M: 775,
    priceTarget12M: 850,
    analystRating: 'BUY',
    marketCap: 1800000000000,
    beta: 1.2,
    lastUpdated: new Date()
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'CLOUD',
    currentPrice: 498,
    currentUnits: 157.8,
    targetPercent: 11,
    priceTarget6M: 545,
    priceTarget12M: 600,
    analystRating: 'BUY',
    marketCap: 3700000000000,
    beta: 0.9,
    lastUpdated: new Date()
  },
  {
    symbol: 'SNOW',
    name: 'Snowflake Inc',
    sector: 'DATA',
    currentPrice: 221,
    currentUnits: 146,
    targetPercent: 5,
    priceTarget6M: 265,
    priceTarget12M: 320,
    analystRating: 'BUY',
    marketCap: 72000000000,
    beta: 1.8,
    lastUpdated: new Date()
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    sector: 'AI_CHIPS',
    currentPrice: 146,
    currentUnits: 0,
    targetPercent: 4,
    priceTarget6M: 185,
    priceTarget12M: 220,
    analystRating: 'BUY',
    marketCap: 235000000000,
    beta: 1.9,
    lastUpdated: new Date()
  },
  {
    symbol: 'CASH',
    name: 'Cash Position',
    sector: 'CASH',
    currentPrice: 1,
    currentUnits: 0,
    targetPercent: 22.5,
    priceTarget6M: 1,
    priceTarget12M: 1,
    analystRating: 'HOLD',
    marketCap: 0,
    beta: 0,
    lastUpdated: new Date()
  }
];

export const INITIAL_PORTFOLIO: Portfolio = {
  totalValue: 0,
  additionalCapital: 50000,
  stocks: INITIAL_STOCKS,
  riskTolerance: 'MODERATE',
  investmentHorizon: '12M',
  lastRebalanced: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
};
