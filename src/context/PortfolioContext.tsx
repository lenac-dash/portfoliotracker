import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Portfolio, Stock } from '../types/portfolio';
import { INITIAL_PORTFOLIO } from '../data/initialPortfolio';
import { calculateTotalPortfolioValue } from '../utils/calculations';

interface PortfolioState {
  portfolio: Portfolio;
  isLoading: boolean;
  lastUpdated: Date;
}

type PortfolioAction =
  | { type: 'UPDATE_STOCK_PRICE'; symbol: string; price: number }
  | { type: 'UPDATE_STOCK_UNITS'; symbol: string; units: number }
  | { type: 'UPDATE_TARGET_ALLOCATION'; symbol: string; targetPercent: number }
  | { type: 'UPDATE_ADDITIONAL_CAPITAL'; amount: number }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'REFRESH_PORTFOLIO' };

interface PortfolioContextType {
  state: PortfolioState;
  updateStockPrice: (symbol: string, price: number) => void;
  updateStockUnits: (symbol: string, units: number) => void;
  updateTargetAllocation: (symbol: string, targetPercent: number) => void;
  updateAdditionalCapital: (amount: number) => void;
  refreshPortfolio: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const portfolioReducer = (state: PortfolioState, action: PortfolioAction): PortfolioState => {
  switch (action.type) {
    case 'UPDATE_STOCK_PRICE': {
      const updatedStocks = state.portfolio.stocks.map(stock =>
        stock.symbol === action.symbol
          ? { ...stock, currentPrice: action.price, lastUpdated: new Date() }
          : stock
      );
      const portfolio = { ...state.portfolio, stocks: updatedStocks };
      portfolio.totalValue = calculateTotalPortfolioValue(updatedStocks);
      
      return {
        ...state,
        portfolio,
        lastUpdated: new Date(),
      };
    }

    case 'UPDATE_STOCK_UNITS': {
      const updatedStocks = state.portfolio.stocks.map(stock =>
        stock.symbol === action.symbol
          ? { ...stock, currentUnits: action.units, lastUpdated: new Date() }
          : stock
      );
      const portfolio = { ...state.portfolio, stocks: updatedStocks };
      portfolio.totalValue = calculateTotalPortfolioValue(updatedStocks);
      
      return {
        ...state,
        portfolio,
        lastUpdated: new Date(),
      };
    }

    case 'UPDATE_TARGET_ALLOCATION': {
      const updatedStocks = state.portfolio.stocks.map(stock =>
        stock.symbol === action.symbol
          ? { ...stock, targetPercent: action.targetPercent }
          : stock
      );
      
      return {
        ...state,
        portfolio: { ...state.portfolio, stocks: updatedStocks },
        lastUpdated: new Date(),
      };
    }

    case 'UPDATE_ADDITIONAL_CAPITAL': {
      return {
        ...state,
        portfolio: { ...state.portfolio, additionalCapital: action.amount },
        lastUpdated: new Date(),
      };
    }

    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.loading,
      };
    }

    case 'REFRESH_PORTFOLIO': {
      const portfolio = { ...state.portfolio };
      portfolio.totalValue = calculateTotalPortfolioValue(portfolio.stocks);
      
      return {
        ...state,
        portfolio,
        lastUpdated: new Date(),
      };
    }

    default:
      return state;
  }
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize portfolio with calculated total value
  const initialPortfolio = { ...INITIAL_PORTFOLIO };
  initialPortfolio.totalValue = calculateTotalPortfolioValue(initialPortfolio.stocks);

  const [state, dispatch] = useReducer(portfolioReducer, {
    portfolio: initialPortfolio,
    isLoading: false,
    lastUpdated: new Date(),
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedPortfolio) {
      try {
        const parsed = JSON.parse(savedPortfolio);
        // Convert date strings back to Date objects
        parsed.stocks = parsed.stocks.map((stock: any) => ({
          ...stock,
          lastUpdated: new Date(stock.lastUpdated),
        }));
        parsed.lastRebalanced = new Date(parsed.lastRebalanced);
        
        dispatch({ type: 'REFRESH_PORTFOLIO' });
      } catch (error) {
        console.error('Error loading portfolio from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever portfolio changes
  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(state.portfolio));
  }, [state.portfolio]);

  const updateStockPrice = (symbol: string, price: number) => {
    dispatch({ type: 'UPDATE_STOCK_PRICE', symbol, price });
  };

  const updateStockUnits = (symbol: string, units: number) => {
    dispatch({ type: 'UPDATE_STOCK_UNITS', symbol, units });
  };

  const updateTargetAllocation = (symbol: string, targetPercent: number) => {
    dispatch({ type: 'UPDATE_TARGET_ALLOCATION', symbol, targetPercent });
  };

  const updateAdditionalCapital = (amount: number) => {
    dispatch({ type: 'UPDATE_ADDITIONAL_CAPITAL', amount });
  };

  const refreshPortfolio = () => {
    dispatch({ type: 'REFRESH_PORTFOLIO' });
  };

  const contextValue: PortfolioContextType = {
    state,
    updateStockPrice,
    updateStockUnits,
    updateTargetAllocation,
    updateAdditionalCapital,
    refreshPortfolio,
  };

  return (
    <PortfolioContext.Provider value={contextValue}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};