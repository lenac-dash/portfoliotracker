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
    symbol: 'ORCL',
    name: 'Oracle Corporation',
    sector: 'CLOUD',
    currentPrice: 231,
    currentUnits: 0,
    targetPercent: 3,
    priceTarget6M: 260,
    priceTarget12M: 300,
    analystRating: 'BUY',
    marketCap: 652000000000,
    beta: 1.1,
    lastUpdated: new Date()
  },
  {
    symbol: 'CEG',
    name: 'Constellation Energy',
    sector: 'ENERGY',
    currentPrice: 322,
    currentUnits: 0,
    targetPercent: 2,
    priceTarget6M: 375,
    priceTarget12M: 450,
    analystRating: 'BUY',
    marketCap: 42000000000,
    beta: 0.8,
    lastUpdated: new Date()
  },
  {
    symbol: 'NET',
    name: 'Cloudflare Inc',
    sector: 'CLOUD',
    currentPrice: 181,
    currentUnits: 0,
    targetPercent: 3,
    priceTarget6M: 225,
    priceTarget12M: 280,
    analystRating: 'BUY',
    marketCap: 62000000000,
    beta: 1.3,
    lastUpdated: new Date()
  },
  {
    symbol: 'CRWV',
    name: 'CoreWeave Inc',
    sector: 'CLOUD',
    currentPrice: 126,
    currentUnits: 0,
    targetPercent: 2,
    priceTarget6M: 165,
    priceTarget12M: 220,
    analystRating: 'HOLD',
    marketCap: 61000000000,
    beta: 2.2,
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
  totalValue: 0, // Will be calculated
  additionalCapital: 50000,
  stocks: INITIAL_STOCKS,
  riskTolerance: 'MODERATE',
  investmentHorizon: '12M',
  lastRebalanced: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
};