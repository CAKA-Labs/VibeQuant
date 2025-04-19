import React, { useState } from 'react';
import FinancialChart from './FinancialChart';

// Mock portfolio data (in real app this would come from an API)
const portfolioData = {
  totalValue: 555000,
  totalProfit: 78450,
  percentageChange: 16.46,
  dailyChange: 1.2,
  investmentReturn: 14.9,
  availableCash: 120000,
  riskScore: 72,
  assetAllocation: [
    { name: '动量反转策略', value: 32, color: '#0abab5' }, 
    { name: '趋势跟踪策略', value: 18, color: '#008080' },  
    { name: '多因子选股策略', value: 28, color: '#39c5bb' }, 
    { name: '高频统计套利', value: 14, color: '#7fd1cb' }, 
    { name: '波动率交易策略', value: 8, color: '#d5f2f0' }     
  ]
};

// Mock historical performance data
const historicalData = {
  '1M': Array.from({ length: 30 }, (_, i) => ({
    date: new Date(2025, 3, i + 1).toISOString().split('T')[0],
    value: 476550 + Math.floor(Math.random() * 12000) - 6000 + i * 2600
  })),
  '3M': Array.from({ length: 90 }, (_, i) => ({
    date: new Date(2025, 1, i + 1).toISOString().split('T')[0],
    value: 426550 + Math.floor(Math.random() * 18000) - 9000 + i * 1420
  })),
  '6M': Array.from({ length: 180 }, (_, i) => ({
    date: new Date(2024, 10, i + 1).toISOString().split('T')[0],
    value: 376550 + Math.floor(Math.random() * 24000) - 12000 + i * 1000
  })),
  '1Y': Array.from({ length: 365 }, (_, i) => ({
    date: new Date(2024, 4, i + 1).toISOString().split('T')[0],
    value: 276550 + Math.floor(Math.random() * 30000) - 15000 + i * 760
  })),
  'YTD': Array.from({ length: 109 }, (_, i) => ({
    date: new Date(2025, 0, i + 1).toISOString().split('T')[0],
    value: 450000 + Math.floor(Math.random() * 20000) - 10000 + i * 960
  })),
  'ALL': Array.from({ length: 730 }, (_, i) => ({
    date: new Date(2023, 4, i + 1).toISOString().split('T')[0],
    value: 150000 + Math.floor(Math.random() * 40000) - 20000 + i * 540
  }))
};

function PortfolioDashboard() {
  const [activeChartPeriod, setActiveChartPeriod] = useState('1M');
  
  return (
    <div className="portfolio-overview">
      <div className="portfolio-summary">
        <div className="portfolio-card">
          <div className="portfolio-card-label">投资组合总值</div>
          <div className="portfolio-card-value">¥{portfolioData.totalValue.toLocaleString()}</div>
          <div className={`portfolio-card-change ${portfolioData.percentageChange >= 0 ? 'positive' : 'negative'}`}>
            {portfolioData.percentageChange >= 0 ? '↑' : '↓'} 
            {portfolioData.percentageChange.toFixed(2)}% 总体收益
          </div>
        </div>
        
        <div className="portfolio-card">
          <div className="portfolio-card-label">总盈利</div>
          <div className="portfolio-card-value">¥{portfolioData.totalProfit.toLocaleString()}</div>
          <div className={`portfolio-card-change ${portfolioData.dailyChange >= 0 ? 'positive' : 'negative'}`}>
            {portfolioData.dailyChange >= 0 ? '↑' : '↓'} 
            {portfolioData.dailyChange.toFixed(2)}% 今日
          </div>
        </div>
        
        <div className="portfolio-card">
          <div className="portfolio-card-label">可用资金</div>
          <div className="portfolio-card-value">¥{portfolioData.availableCash.toLocaleString()}</div>
          <div className="portfolio-card-change">
            {((portfolioData.availableCash / portfolioData.totalValue) * 100).toFixed(1)}% 未配置
          </div>
        </div>
        
        <div className="portfolio-card">
          <div className="portfolio-card-label">投资回报率</div>
          <div className="portfolio-card-value">{portfolioData.investmentReturn}%</div>
          <div className="portfolio-card-change">
            风险评分: {portfolioData.riskScore}/100
          </div>
        </div>
      </div>
      
      <div className="chart-section">
        <div className="portfolio-chart">
          <div className="chart-header">
            <h3 className="chart-title">资产表现</h3>
            <div className="chart-controls">
              <button 
                className={`chart-period-btn ${activeChartPeriod === '1M' ? 'active' : ''}`}
                onClick={() => setActiveChartPeriod('1M')}
              >
                1月
              </button>
              <button 
                className={`chart-period-btn ${activeChartPeriod === '3M' ? 'active' : ''}`}
                onClick={() => setActiveChartPeriod('3M')}
              >
                3月
              </button>
              <button 
                className={`chart-period-btn ${activeChartPeriod === '6M' ? 'active' : ''}`}
                onClick={() => setActiveChartPeriod('6M')}
              >
                6月
              </button>
              <button 
                className={`chart-period-btn ${activeChartPeriod === '1Y' ? 'active' : ''}`}
                onClick={() => setActiveChartPeriod('1Y')}
              >
                1年
              </button>
              <button 
                className={`chart-period-btn ${activeChartPeriod === 'YTD' ? 'active' : ''}`}
                onClick={() => setActiveChartPeriod('YTD')}
              >
                今年
              </button>
              <button 
                className={`chart-period-btn ${activeChartPeriod === 'ALL' ? 'active' : ''}`}
                onClick={() => setActiveChartPeriod('ALL')}
              >
                全部
              </button>
            </div>
          </div>
          <div style={{ flexGrow: 1 }}>
            <FinancialChart 
              data={historicalData[activeChartPeriod]} 
              height={280} 
            />
          </div>
        </div>
        
        <div className="asset-allocation">
          <div className="chart-header">
            <h3 className="chart-title">策略分配</h3>
          </div>
          <div className="allocation-list">
            {portfolioData.assetAllocation.map((asset, index) => (
              <div key={index} className="allocation-item">
                <div className="allocation-label">
                  <div className="allocation-dot" style={{ backgroundColor: asset.color }}></div>
                  <span>{asset.name}</span>
                </div>
                <div className="allocation-value">{asset.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioDashboard;
