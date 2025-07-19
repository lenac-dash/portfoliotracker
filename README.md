# AI Portfolio Rebalancer

A comprehensive, professional-grade portfolio management application for AI-focused investments with real-time calculations, interactive controls, and advanced analytics.

## 🚀 Features

### Core Functionality
- **Real-time Portfolio Monitoring**: Track your AI-focused portfolio with live calculations
- **Interactive Rebalancing**: Precision portfolio rebalancing with drag-and-drop controls
- **Advanced Analytics**: Risk metrics, return projections, and performance analysis
- **Trade Recommendations**: AI-powered trade suggestions with priority ranking
- **Sector Analysis**: Deep dive into AI sectors (Chips, Cloud, Apps, Data, Energy)

### Professional Dashboard
- **Multi-tab Interface**: Overview, Rebalancing, and Analytics tabs
- **Interactive Charts**: Pie charts, bar charts, line graphs, and radar charts
- **Real-time Calculations**: Live updates for all portfolio metrics
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### AI Investment Focus
- **AI Chip Stocks**: NVIDIA, AMD with GPU demand analysis
- **Cloud Infrastructure**: Microsoft, Oracle, Cloudflare with AI services tracking
- **AI Applications**: Meta with social AI integration
- **Data Analytics**: Snowflake with AI data processing
- **Energy Infrastructure**: Constellation Energy for data center power needs

## 📊 Portfolio Data

### Current Holdings
- **NVIDIA (NVDA)**: 40% target allocation - AI chip leader
- **Microsoft (MSFT)**: 11% target allocation - Cloud AI services
- **Meta (META)**: 7.5% target allocation - AI applications
- **Snowflake (SNOW)**: 5% target allocation - AI data platform
- **AMD**: 4% target allocation - AI chip competitor
- **Oracle (ORCL)**: 3% target allocation - Database AI
- **Cloudflare (NET)**: 3% target allocation - Edge AI
- **CoreWeave (CRWV)**: 2% target allocation - GPU cloud
- **Constellation Energy (CEG)**: 2% target allocation - Nuclear power
- **Cash**: 22.5% target allocation - Deployment ready

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for consistent iconography
- **State Management**: React Context with useReducer
- **Data Persistence**: localStorage for portfolio state

## 📱 User Interface

### Overview Tab
- Portfolio composition pie chart
- Sector allocation vs target comparison
- Holdings table with real-time metrics
- Top performers analysis

### Rebalancing Tab
- Interactive portfolio calculator
- Editable prices, units, and target allocations
- Real-time trade recommendations
- Rebalancing summary with cash flow analysis

### Analytics Tab
- Return projections (6M, 12M scenarios)
- Risk metrics dashboard
- Historical performance vs benchmarks
- AI sector performance radar
- Asset correlation matrix
- AI investment thesis tracking

## 🎯 Key Calculations

### Portfolio Metrics
```typescript
- Current Value = Units × Current Price
- Current % = (Current Value / Total Value) × 100
- Target Value = (Total Value × Target %) / 100
- Rebalance Amount = Target Value - Current Value
- Units Needed = Rebalance Amount / Current Price
```

### Risk Analysis
- Portfolio Beta calculation
- Sharpe Ratio estimation
- Maximum Drawdown analysis
- Volatility measurements

### Return Projections
- Conservative, Base, and Optimistic scenarios
- 6-month and 12-month projections
- Price target-based calculations

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-rebalancer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 💼 Usage Guide

### Getting Started
1. The application loads with pre-configured AI portfolio data
2. Navigate between tabs to explore different features
3. All data is automatically saved to localStorage

### Rebalancing Your Portfolio
1. Go to the "Rebalancing" tab
2. Click edit icons to modify prices, units, or target allocations
3. Review trade recommendations in real-time
4. Execute rebalancing plan when ready

### Analyzing Performance
1. Visit the "Analytics" tab for detailed analysis
2. Review return projections for different scenarios
3. Monitor risk metrics and correlation analysis
4. Track AI investment thesis indicators

## 📈 Investment Strategy

### AI-Focused Approach
This portfolio is designed around the AI revolution with strategic allocations across:

- **Infrastructure Layer**: GPU chips (NVDA, AMD) and power (CEG)
- **Platform Layer**: Cloud services (MSFT, ORCL, NET, CRWV)
- **Application Layer**: AI applications (META) and data (SNOW)
- **Cash Position**: 22.5% for opportunistic deployment

### Risk Management
- Diversified across AI value chain
- Beta-weighted risk assessment
- Correlation analysis for concentration risk
- Regular rebalancing recommendations

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] Real-time market data integration
- [ ] Advanced options strategies
- [ ] Tax-loss harvesting
- [ ] Alert system for portfolio drift
- [ ] Mobile app version

### Phase 3 Features
- [ ] AI-powered trade execution
- [ ] Multi-account management
- [ ] Advanced research integration
- [ ] Social trading features
- [ ] Institutional-grade reporting

## ⚡ Performance

- **Instant Calculations**: All metrics update in real-time
- **Responsive Design**: Optimized for all screen sizes
- **Local Storage**: Portfolio state persists between sessions
- **Efficient Rendering**: React optimization for smooth interactions

## 🛡️ Security & Privacy

- All calculations performed client-side
- No sensitive data transmitted to servers
- Portfolio data stored locally in browser
- No third-party tracking or analytics

## 📊 Data Models

The application uses TypeScript interfaces for type safety:
- `Stock`: Individual stock holdings and metadata
- `Portfolio`: Complete portfolio with settings
- `TradeRecommendation`: Rebalancing suggestions
- `PortfolioMetrics`: Performance calculations

## 🎨 Design System

Professional financial application design with:
- Clean, readable typography
- Consistent color palette for gains/losses
- Professional card layouts
- Interactive hover states
- Accessible form controls

## 📞 Support

For questions, feature requests, or bug reports, please create an issue in the repository.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built for serious AI investors who demand professional-grade portfolio management tools.**
