import React, { useState, useEffect } from 'react';
import './pipeline.css';

// 模拟实时交易数据
const initialLiveTradings = [
  {
    id: 1,
    name: "动量反转策略实盘",
    strategyId: 1,
    status: "running", // running, paused, stopped
    startDate: "2025-03-01",
    initialCapital: 1000000,
    currentValue: 1089500,
    pnl: 8.95,
    todayPnl: 0.8,
    trades: [
      { id: 1, time: "2025-04-20 09:31:05", symbol: "600519", side: "buy", price: 1820.50, quantity: 100, amount: 182050, status: "filled" },
      { id: 2, time: "2025-04-19 14:56:32", symbol: "000858", side: "sell", price: 68.75, quantity: 2000, amount: 137500, status: "filled" },
      { id: 3, time: "2025-04-18 10:15:43", symbol: "601318", side: "buy", price: 42.35, quantity: 3000, amount: 127050, status: "filled" },
      { id: 4, time: "2025-04-17 13:28:17", symbol: "600036", side: "sell", price: 36.20, quantity: 5000, amount: 181000, status: "filled" },
      { id: 5, time: "2025-04-16 15:01:22", symbol: "601166", side: "buy", price: 18.75, quantity: 4000, amount: 75000, status: "filled" }
    ],
    positions: [
      { symbol: "600519", name: "贵州茅台", quantity: 100, costPrice: 1820.50, currentPrice: 1830.75, pnl: 0.56, weight: 18.3 },
      { symbol: "601318", name: "中国平安", quantity: 3000, costPrice: 42.35, currentPrice: 43.20, pnl: 2.01, weight: 12.7 },
      { symbol: "601166", name: "兴业银行", quantity: 4000, costPrice: 18.75, currentPrice: 19.15, pnl: 2.13, weight: 7.5 },
      { symbol: "600276", name: "恒瑞医药", quantity: 2000, costPrice: 28.35, currentPrice: 27.80, pnl: -1.94, weight: 5.4 },
      { symbol: "600887", name: "伊利股份", quantity: 6000, costPrice: 24.85, currentPrice: 25.60, pnl: 3.02, weight: 15.0 }
    ],
    performance: {
      dailyReturns: [0.3, -0.5, 1.2, 0.8, -0.2, 0.5, 1.1, -0.3, 0.7, 0.4],
      cumulativeReturns: [0.3, -0.2, 1.0, 1.8, 1.6, 2.1, 3.2, 2.9, 3.6, 4.0],
      benchmarkReturns: [0.1, -0.3, 0.5, 0.6, -0.1, 0.2, 0.8, -0.5, 0.3, 0.1],
      benchmarkCumulative: [0.1, -0.2, 0.3, 0.9, 0.8, 1.0, 1.8, 1.3, 1.6, 1.7],
      dates: ["04-11", "04-12", "04-13", "04-14", "04-15", "04-16", "04-17", "04-18", "04-19", "04-20"]
    },
    settings: {
      capital: 1000000,
      maxPositions: 20,
      maxPositionSize: 20, // percentage of portfolio
      stopLoss: 8, // percentage
      takeProfit: 20, // percentage
      commissionRate: 0.0005,
      rebalancingFrequency: "daily",
      tradingHours: "normal", // normal, extended
      benchmark: "000300", // CSI 300
      riskControl: true
    }
  },
  {
    id: 2,
    name: "趋势跟踪策略实盘",
    strategyId: 2,
    status: "paused", // running, paused, stopped
    startDate: "2025-02-15",
    initialCapital: 750000,
    currentValue: 795000,
    pnl: 6.0,
    todayPnl: -0.3,
    trades: [
      { id: 6, time: "2025-04-19 09:45:18", symbol: "601888", side: "sell", price: 172.30, quantity: 500, amount: 86150, status: "filled" },
      { id: 7, time: "2025-04-18 14:22:05", symbol: "600809", side: "buy", price: 58.60, quantity: 1000, amount: 58600, status: "filled" },
      { id: 8, time: "2025-04-17 11:03:52", symbol: "601668", side: "sell", price: 12.35, quantity: 5000, amount: 61750, status: "filled" },
      { id: 9, time: "2025-04-16 10:35:24", symbol: "600031", side: "buy", price: 32.80, quantity: 2000, amount: 65600, status: "filled" },
      { id: 10, time: "2025-04-15 13:50:37", symbol: "600196", side: "buy", price: 45.20, quantity: 1200, amount: 54240, status: "filled" }
    ],
    positions: [
      { symbol: "600809", name: "山西汾酒", quantity: 1000, costPrice: 58.60, currentPrice: 57.90, pnl: -1.19, weight: 7.3 },
      { symbol: "600031", name: "三一重工", quantity: 2000, costPrice: 32.80, currentPrice: 33.45, pnl: 1.98, weight: 8.4 },
      { symbol: "600196", name: "复星医药", quantity: 1200, costPrice: 45.20, currentPrice: 44.85, pnl: -0.77, weight: 6.8 },
      { symbol: "601398", name: "工商银行", quantity: 15000, costPrice: 5.35, currentPrice: 5.42, pnl: 1.31, weight: 10.2 },
      { symbol: "600028", name: "中国石化", quantity: 25000, costPrice: 6.05, currentPrice: 6.12, pnl: 1.16, weight: 19.2 }
    ],
    performance: {
      dailyReturns: [0.2, 0.3, -0.4, 0.5, 0.6, -0.2, 0.4, 0.7, -0.3, -0.3],
      cumulativeReturns: [0.2, 0.5, 0.1, 0.6, 1.2, 1.0, 1.4, 2.1, 1.8, 1.5],
      benchmarkReturns: [0.1, 0.2, -0.3, 0.4, 0.3, -0.1, 0.3, 0.4, -0.5, -0.1],
      benchmarkCumulative: [0.1, 0.3, 0.0, 0.4, 0.7, 0.6, 0.9, 1.3, 0.8, 0.7],
      dates: ["04-11", "04-12", "04-13", "04-14", "04-15", "04-16", "04-17", "04-18", "04-19", "04-20"]
    },
    settings: {
      capital: 750000,
      maxPositions: 15,
      maxPositionSize: 25, // percentage of portfolio
      stopLoss: 10, // percentage
      takeProfit: 25, // percentage
      commissionRate: 0.0005,
      rebalancingFrequency: "weekly",
      tradingHours: "normal", // normal, extended
      benchmark: "000300", // CSI 300
      riskControl: true
    }
  }
];

// 全局状态管理
const globalLiveTradingState = {
  liveTradings: [...initialLiveTradings]
};

export function LiveModule() {
  const [liveTradings, setLiveTradings] = useState(globalLiveTradingState.liveTradings);
  const [selectedTrading, setSelectedTrading] = useState(liveTradings[0] || null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreating, setIsCreating] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 设置定时器更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 创建新的实时交易策略
  const createNewLiveTrading = () => {
    setIsCreating(true);
    setActiveTab('settings');
    setSelectedTrading(null);
  };

  // 启动交易策略
  const startTrading = (id) => {
    const updatedTradings = liveTradings.map(t => 
      t.id === id ? { ...t, status: "running" } : t
    );
    setLiveTradings(updatedTradings);
    globalLiveTradingState.liveTradings = updatedTradings;
  };

  // 暂停交易策略
  const pauseTrading = (id) => {
    const updatedTradings = liveTradings.map(t => 
      t.id === id ? { ...t, status: "paused" } : t
    );
    setLiveTradings(updatedTradings);
    globalLiveTradingState.liveTradings = updatedTradings;
  };

  // 停止交易策略
  const stopTrading = (id) => {
    if(window.confirm('确定要停止此交易策略吗？停止后将不再继续交易。')) {
      const updatedTradings = liveTradings.map(t => 
        t.id === id ? { ...t, status: "stopped" } : t
      );
      setLiveTradings(updatedTradings);
      globalLiveTradingState.liveTradings = updatedTradings;
    }
  };

  // 删除交易策略
  const deleteTrading = (id) => {
    if(window.confirm('确定要删除此交易策略吗？此操作不可恢复。')) {
      const updatedTradings = liveTradings.filter(t => t.id !== id);
      setLiveTradings(updatedTradings);
      globalLiveTradingState.liveTradings = updatedTradings;
      
      if(selectedTrading && selectedTrading.id === id) {
        setSelectedTrading(updatedTradings[0] || null);
      }
    }
  };

  // 选择交易策略
  const selectTrading = (trading) => {
    setSelectedTrading(trading);
    setActiveTab('overview');
    setIsCreating(false);
  };

  // 格式化百分比
  const formatPercent = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  // 格式化金额
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // 格式化时间
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // 获取状态显示文本
  const getStatusText = (status) => {
    switch(status) {
      case 'running': return '运行中';
      case 'paused': return '已暂停';
      case 'stopped': return '已停止';
      default: return '未知状态';
    }
  };

  // 获取状态对应的颜色类
  const getStatusClass = (status) => {
    switch(status) {
      case 'running': return 'success';
      case 'paused': return 'warning';
      case 'stopped': return 'error';
      default: return 'gray';
    }
  };

  return (
    <div className="pipeline-module">
      <div className="module-toolbar">
        <div className="toolbar-tabs">
          <button 
            className={`toolbar-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
            disabled={isCreating || !selectedTrading}
          >
            概览
          </button>
          <button 
            className={`toolbar-tab ${activeTab === 'market' ? 'active' : ''}`}
            onClick={() => setActiveTab('market')}
          >
            市场行情
          </button>
          <button 
            className={`toolbar-tab ${activeTab === 'positions' ? 'active' : ''}`}
            onClick={() => setActiveTab('positions')}
            disabled={isCreating || !selectedTrading}
          >
            持仓
          </button>
          <button 
            className={`toolbar-tab ${activeTab === 'trades' ? 'active' : ''}`}
            onClick={() => setActiveTab('trades')}
            disabled={isCreating || !selectedTrading}
          >
            交易记录
          </button>
          <button 
            className={`toolbar-tab ${activeTab === 'assistant' ? 'active' : ''}`}
            onClick={() => setActiveTab('assistant')}
          >
            交易助手
          </button>
          <button 
            className={`toolbar-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            disabled={(!selectedTrading && !isCreating)}
          >
            交易设置
          </button>
          <button 
            className={`toolbar-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            历史策略
          </button>
        </div>
        <div className="toolbar-spacer"></div>
        <button 
          className="btn-tiffany"
          onClick={createNewLiveTrading}
          disabled={isCreating}
        >
          部署新策略
        </button>
      </div>

      <div className="module-content">
        {activeTab === 'overview' && selectedTrading && (
          <LiveTradingOverview 
            trading={selectedTrading} 
            formatPercent={formatPercent}
            formatCurrency={formatCurrency}
            currentTime={currentTime}
            onStart={() => startTrading(selectedTrading.id)}
            onPause={() => pauseTrading(selectedTrading.id)}
            onStop={() => stopTrading(selectedTrading.id)}
            onShowSettings={() => setShowSettingsModal(true)}
          />
        )}
        
        {activeTab === 'market' && (
          <MarketMonitor 
            trading={selectedTrading}
            currentTime={currentTime}
          />
        )}
        
        {activeTab === 'positions' && selectedTrading && (
          <PositionsTable 
            positions={selectedTrading.positions}
            formatPercent={formatPercent}
          />
        )}
        
        {activeTab === 'trades' && selectedTrading && (
          <TradesTable 
            trades={selectedTrading.trades}
            formatTime={formatTime}
            formatCurrency={formatCurrency}
          />
        )}
        
        {activeTab === 'assistant' && (
          <TradingAssistant trading={selectedTrading} />
        )}
        
        {activeTab === 'settings' && (
          <LiveTradingSettings 
            isCreating={isCreating}
            trading={selectedTrading}
            onSave={() => {
              // 保存实现逻辑
            }}
            onCancel={() => {
              if(isCreating) {
                setIsCreating(false);
                setSelectedTrading(liveTradings[0] || null);
                setActiveTab('overview');
              } else {
                setActiveTab('overview');
              }
            }}
          />
        )}
        
        {activeTab === 'history' && (
          <div className="fade-in">
            <h3 className="module-section-title">交易策略历史</h3>
            
            {liveTradings.length === 0 ? (
              <div className="empty-state">
                <p className="empty-description">暂无交易策略</p>
                <button 
                  className="btn-tiffany"
                  onClick={createNewLiveTrading}
                >
                  部署新策略
                </button>
              </div>
            ) : (
              <div className="pipeline-card">
                <table className="table">
                  <thead>
                    <tr>
                      <th>策略名称</th>
                      <th>开始时间</th>
                      <th>当前收益</th>
                      <th>今日收益</th>
                      <th>状态</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveTradings.map(trading => (
                      <tr 
                        key={trading.id}
                        className={selectedTrading && selectedTrading.id === trading.id ? 'selected-row' : ''}
                      >
                        <td>{trading.name}</td>
                        <td>{trading.startDate}</td>
                        <td className={trading.pnl >= 0 ? 'text-success' : 'text-error'}>
                          {formatPercent(trading.pnl)}
                        </td>
                        <td className={trading.todayPnl >= 0 ? 'text-success' : 'text-error'}>
                          {formatPercent(trading.todayPnl)}
                        </td>
                        <td>
                          <span className={`tag tag-${getStatusClass(trading.status)}`}>
                            {getStatusText(trading.status)}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button 
                              className="btn-icon"
                              onClick={() => selectTrading(trading)}
                              title="查看详情"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </button>
                            {trading.status === 'running' && (
                              <button 
                                className="btn-icon"
                                onClick={() => pauseTrading(trading.id)}
                                title="暂停"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="6" y="4" width="4" height="16"></rect>
                                  <rect x="14" y="4" width="4" height="16"></rect>
                                </svg>
                              </button>
                            )}
                            {trading.status === 'paused' && (
                              <button 
                                className="btn-icon"
                                onClick={() => startTrading(trading.id)}
                                title="启动"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                              </button>
                            )}
                            <button 
                              className="btn-icon"
                              onClick={() => deleteTrading(trading.id)}
                              title="删除"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {showSettingsModal && selectedTrading && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>交易设置</h3>
                <button className="btn-icon" onClick={() => setShowSettingsModal(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                {/* 设置内容 */}
              </div>
              <div className="modal-footer">
                <button className="btn-tiffany" onClick={() => setShowSettingsModal(false)}>取消</button>
                <button className="btn-tiffany">保存设置</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 实时交易概览组件
function LiveTradingOverview({ 
  trading, 
  formatPercent, 
  formatCurrency, 
  currentTime,
  onStart,
  onPause,
  onStop,
  onShowSettings
}) {
  if (!trading) return null;
  
  // 获取交易所交易时间
  const isMarketOpen = () => {
    const now = currentTime;
    const hour = now.getHours();
    const minute = now.getMinutes();
    const day = now.getDay();
    
    // 周末市场关闭
    if (day === 0 || day === 6) return false;
    
    // 上午时段: 9:30 - 11:30
    const isMorningSession = (hour === 9 && minute >= 30) || (hour === 10) || (hour === 11 && minute <= 30);
    
    // 下午时段: 13:00 - 15:00
    const isAfternoonSession = (hour >= 13 && hour < 15);
    
    return isMorningSession || isAfternoonSession;
  };
  
  // 获取市场状态描述
  const getMarketStatus = () => {
    if (isMarketOpen()) {
      return <span className="market-open">市场开放中</span>;
    } else {
      return <span className="market-closed">市场休市</span>;
    }
  };
  
  // 构建性能图表数据
  const performanceData = trading.performance;
  
  return (
    <div className="fade-in">
      <div className="live-trading-header">
        <div>
          <h3 className="module-section-title">{trading.name}</h3>
          <div className="live-trading-status">
            <span className={`status-dot status-${trading.status}`}></span>
            <span className="status-text">{trading.status === 'running' ? '运行中' : trading.status === 'paused' ? '已暂停' : '已停止'}</span>
            <span className="market-status-separator">|</span>
            {getMarketStatus()}
            <span className="market-status-separator">|</span>
            <span className="live-time">{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="live-trading-actions">
          {trading.status === 'running' ? (
            <button className="btn-tiffany-danger" onClick={onPause}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
              暂停
            </button>
          ) : (
            <button className="btn-tiffany" onClick={onStart}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              启动
            </button>
          )}
          <button className="btn-tiffany-danger" onClick={onStop}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
            停止
          </button>
          <button className="btn-tiffany" onClick={onShowSettings}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            设置
          </button>
        </div>
      </div>

      <div className="live-trading-overview">
        <div className="pipeline-card">
          <div className="performance-metrics">
            <div className="metric-group">
              <div className="metric-large">
                <div className="metric-title">总收益率</div>
                <div className={`metric-value ${trading.pnl >= 0 ? 'positive' : 'negative'}`}>
                  {formatPercent(trading.pnl)}
                </div>
                <div className="metric-subtitle">({formatCurrency(trading.currentValue - trading.initialCapital)})</div>
              </div>
              <div className="metric-large">
                <div className="metric-title">今日收益</div>
                <div className={`metric-value ${trading.todayPnl >= 0 ? 'positive' : 'negative'}`}>
                  {formatPercent(trading.todayPnl)}
                </div>
              </div>
            </div>
            
            <div className="metric-group">
              <div className="metric-small">
                <div className="metric-title">初始资金</div>
                <div className="metric-value">{formatCurrency(trading.initialCapital)}</div>
              </div>
              <div className="metric-small">
                <div className="metric-title">当前价值</div>
                <div className="metric-value">{formatCurrency(trading.currentValue)}</div>
              </div>
              <div className="metric-small">
                <div className="metric-title">持仓数量</div>
                <div className="metric-value">{trading.positions.length}</div>
              </div>
              <div className="metric-small">
                <div className="metric-title">开始日期</div>
                <div className="metric-value">{trading.startDate}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pipeline-card mt-4">
          <h4 className="card-title">收益走势</h4>
          <div className="live-trading-chart">
            <LivePerformanceChart data={performanceData} />
          </div>
        </div>
        
        <div className="pipeline-card mt-4">
          <h4 className="card-title">最近交易</h4>
          <table className="table">
            <thead>
              <tr>
                <th>时间</th>
                <th>股票</th>
                <th>方向</th>
                <th>价格</th>
                <th>数量</th>
                <th>金额</th>
              </tr>
            </thead>
            <tbody>
              {trading.trades.slice(0, 3).map(trade => (
                <tr key={trade.id}>
                  <td>{trade.time}</td>
                  <td>{trade.symbol}</td>
                  <td className={trade.side === 'buy' ? 'text-success' : 'text-error'}>
                    {trade.side === 'buy' ? '买入' : '卖出'}
                  </td>
                  <td>{trade.price.toFixed(2)}</td>
                  <td>{trade.quantity}</td>
                  <td>{formatCurrency(trade.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 实时交易性能图表组件
function LivePerformanceChart({ data }) {
  if (!data) return null;
  
  const chartWidth = 800;
  const chartHeight = 300;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };
  const contentWidth = chartWidth - padding.left - padding.right;
  const contentHeight = chartHeight - padding.top - padding.bottom;
  
  // 计算最大和最小值
  const allValues = [...data.cumulativeReturns, ...data.benchmarkCumulative];
  const maxValue = Math.max(...allValues) * 1.1;
  const minValue = Math.min(0, Math.min(...allValues) * 1.1);
  
  // 计算刻度
  const yScale = value => contentHeight - ((value - minValue) / (maxValue - minValue) * contentHeight);
  const xScale = index => padding.left + (index / (data.dates.length - 1)) * contentWidth;
  
  // 生成折线点
  const strategyPoints = data.cumulativeReturns.map((value, index) => 
    `${xScale(index)},${yScale(value)}`
  ).join(' ');
  
  const benchmarkPoints = data.benchmarkCumulative.map((value, index) => 
    `${xScale(index)},${yScale(value)}`
  ).join(' ');
  
  // 生成渐变区域路径
  const strategyAreaPath = `
    M ${xScale(0)},${yScale(0)} 
    L ${data.cumulativeReturns.map((value, index) => `${xScale(index)},${yScale(value)}`).join(' L ')} 
    L ${xScale(data.cumulativeReturns.length - 1)},${yScale(0)} Z
  `;
  
  return (
    <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
      {/* 背景网格线 */}
      {Array.from({ length: 5 }).map((_, i) => {
        const y = yScale(minValue + (maxValue - minValue) * (i / 4));
        return (
          <line 
            key={`grid-${i}`}
            x1={padding.left}
            y1={y}
            x2={chartWidth - padding.right}
            y2={y}
            stroke="#eee"
            strokeWidth="1"
          />
        );
      })}
      
      {/* Y轴刻度标签 */}
      {Array.from({ length: 5 }).map((_, i) => {
        const value = minValue + (maxValue - minValue) * (i / 4);
        const y = yScale(value);
        return (
          <text
            key={`label-${i}`}
            x={padding.left - 5}
            y={y}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize="12"
            fill="#666"
          >
            {(value * 100).toFixed(1)}%
          </text>
        );
      })}
      
      {/* X轴日期标签 */}
      {data.dates.filter((_, i) => i % 2 === 0 || i === data.dates.length - 1).map((date, i) => {
        const x = xScale(i * 2);
        return (
          <text
            key={`date-${i}`}
            x={x}
            y={chartHeight - 10}
            textAnchor="middle"
            fontSize="12"
            fill="#666"
          >
            {date}
          </text>
        );
      })}
      
      {/* 基准线（0%收益线）*/}
      <line
        x1={padding.left}
        y1={yScale(0)}
        x2={chartWidth - padding.right}
        y2={yScale(0)}
        stroke="#ccc"
        strokeWidth="1"
        strokeDasharray="5,5"
      />
      
      {/* 策略收益区域 */}
      <path
        d={strategyAreaPath}
        fill="rgba(10, 186, 181, 0.1)"
      />
      
      {/* 基准线 */}
      <polyline
        points={benchmarkPoints}
        fill="none"
        stroke="#888"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      
      {/* 策略线 */}
      <polyline
        points={strategyPoints}
        fill="none"
        stroke="#0abab5"
        strokeWidth="2"
      />
      
      {/* 图例 */}
      <rect x={padding.left} y={padding.top} width="12" height="3" fill="#0abab5" />
      <text x={padding.left + 18} y={padding.top + 4} fontSize="12" fill="#666">策略收益</text>
      
      <rect x={padding.left + 100} y={padding.top} width="12" height="3" fill="#888" />
      <text x={padding.left + 118} y={padding.top + 4} fontSize="12" fill="#666">基准收益</text>
    </svg>
  );
}

// 持仓表格组件
function PositionsTable({ positions, formatPercent }) {
  if (!positions || positions.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-description">当前没有持仓</p>
        <button 
          className="btn-tiffany"
          onClick={() => console.log('部署新策略')}
        >
          部署新策略
        </button>
      </div>
    );
  }
  
  // 计算总持仓价值
  const totalValue = positions.reduce((sum, pos) => sum + (pos.currentPrice * pos.quantity), 0);
  
  return (
    <div className="fade-in">
      <h3 className="module-section-title">当前持仓 ({positions.length})</h3>
      <div className="pipeline-card">
        <table className="table">
          <thead>
            <tr>
              <th>代码</th>
              <th>名称</th>
              <th>数量</th>
              <th>成本价</th>
              <th>现价</th>
              <th>盈亏</th>
              <th>权重</th>
            </tr>
          </thead>
          <tbody>
            {positions.map(position => (
              <tr key={position.symbol}>
                <td>{position.symbol}</td>
                <td>{position.name}</td>
                <td>{position.quantity.toLocaleString()}</td>
                <td>{position.costPrice.toFixed(2)}</td>
                <td>{position.currentPrice.toFixed(2)}</td>
                <td className={position.pnl >= 0 ? 'text-success' : 'text-error'}>
                  {formatPercent(position.pnl)}
                </td>
                <td>
                  <div className="weight-bar-container">
                    <div className="weight-bar" style={{ width: `${position.weight}%` }}></div>
                    <span className="weight-value">{position.weight.toFixed(1)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="positions-chart pipeline-card mt-4">
        <h4 className="card-title">持仓分布</h4>
        <div className="chart-container">
          <PortfolioPieChart positions={positions} />
        </div>
      </div>
    </div>
  );
}

// 持仓饼图组件
function PortfolioPieChart({ positions }) {
  const colors = [
    '#0abab5', '#34c3be', '#5fccc8', '#8ad5d3', '#b5e0dd', 
    '#4b93e0', '#5a9fe4', '#77b5eb', '#94cbf1', '#b1e0f8',
    '#f5bd41', '#f7c75c', '#f9d177', '#fbdc92', '#fde7ad'
  ];
  
  const totalValue = positions.reduce((sum, pos) => sum + (pos.currentPrice * pos.quantity), 0);
  const radius = 120;
  const centerX = 200;
  const centerY = 200;
  
  // 生成饼图扇区
  let currentAngle = 0;
  const sectors = positions.map((position, index) => {
    const value = position.currentPrice * position.quantity;
    const percentage = (value / totalValue * 100);
    const angle = percentage * 3.6; // 转换为角度 (100% = 360度)
    
    // 计算扇区路径
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    // 标签位置
    const labelRad = (startAngle + angle / 2 - 90) * Math.PI / 180;
    const labelDistance = radius * 0.7; // 标签到中心的距离
    const labelX = centerX + labelDistance * Math.cos(labelRad);
    const labelY = centerY + labelDistance * Math.sin(labelRad);
    
    // 外部标签线
    const lineEndDistance = radius * 1.1;
    const lineEndX = centerX + lineEndDistance * Math.cos(labelRad);
    const lineEndY = centerY + lineEndDistance * Math.sin(labelRad);
    
    // 外部文本位置
    const textDistance = radius * 1.2;
    const textX = centerX + textDistance * Math.cos(labelRad);
    const textY = centerY + textDistance * Math.sin(labelRad);
    
    return {
      path: `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color: colors[index % colors.length],
      name: position.name,
      symbol: position.symbol,
      percentage,
      labelX,
      labelY,
      lineEndX,
      lineEndY,
      textX,
      textY,
      textAnchor: labelRad > 0 && labelRad < Math.PI ? 'start' : 'end'
    };
  });
  
  return (
    <svg width="100%" height="400" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
      {/* 饼图扇区 */}
      {sectors.map((sector, index) => (
        <path
          key={`sector-${index}`}
          d={sector.path}
          fill={sector.color}
          stroke="#fff"
          strokeWidth="1"
        />
      ))}
      
      {/* 标签和连接线 */}
      {sectors.map((sector, index) => (
        <g key={`label-${index}`}>
          {sector.percentage > 5 && (
            <>
              <line
                x1={sector.labelX}
                y1={sector.labelY}
                x2={sector.lineEndX}
                y2={sector.lineEndY}
                stroke="#888"
                strokeWidth="1"
              />
              <text
                x={sector.textX}
                y={sector.textY}
                textAnchor={sector.textAnchor}
                dominantBaseline="middle"
                fontSize="12"
                fill="#333"
              >
                {sector.symbol} ({sector.percentage.toFixed(1)}%)
              </text>
            </>
          )}
        </g>
      ))}
      
      {/* 中心圈 */}
      <circle cx={centerX} cy={centerY} r="40" fill="#fff" stroke="#eee" strokeWidth="1" />
      <text x={centerX} y={centerY - 8} textAnchor="middle" fontSize="14" fontWeight="500" fill="#333">总持仓</text>
      <text x={centerX} y={centerY + 12} textAnchor="middle" fontSize="12" fill="#666">{positions.length}个品种</text>
    </svg>
  );
}

// 交易记录表格组件
function TradesTable({ trades, formatTime, formatCurrency }) {
  if (!trades || trades.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-description">暂无交易记录</p>
        <button 
          className="btn-tiffany"
          onClick={() => console.log('部署新策略')}
        >
          部署新策略
        </button>
      </div>
    );
  }
  
  return (
    <div className="fade-in">
      <h3 className="module-section-title">交易记录</h3>
      <div className="pipeline-card">
        <table className="table">
          <thead>
            <tr>
              <th>时间</th>
              <th>代码</th>
              <th>方向</th>
              <th>价格</th>
              <th>数量</th>
              <th>金额</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {trades.map(trade => (
              <tr key={trade.id}>
                <td>{trade.time}</td>
                <td>{trade.symbol}</td>
                <td className={trade.side === 'buy' ? 'text-success' : 'text-error'}>
                  {trade.side === 'buy' ? '买入' : '卖出'}
                </td>
                <td>{trade.price.toFixed(2)}</td>
                <td>{trade.quantity.toLocaleString()}</td>
                <td>{formatCurrency(trade.amount)}</td>
                <td>
                  <span className={`tag tag-${trade.status === 'filled' ? 'success' : trade.status === 'pending' ? 'warning' : 'error'}`}>
                    {trade.status === 'filled' ? '已成交' : 
                     trade.status === 'pending' ? '待成交' : '已取消'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 实时交易设置组件
function LiveTradingSettings({ isCreating, trading, onSave, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [settings, setSettings] = useState(
    isCreating ? {
      name: "新交易策略",
      strategyId: "1",
      settings: {
        capital: 1000000,
        maxPositions: 20,
        maxPositionSize: 20, // percentage of portfolio
        stopLoss: 8,
        takeProfit: 20,
        commissionRate: 0.0005,
        rebalancingFrequency: "daily",
        tradingHours: "normal",
        benchmark: "000300",
        riskControl: true
      }
    } : trading
  );
  
  const totalSteps = 3;
  
  // 前进到下一步
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // 返回上一步
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // 处理设置变化
  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  // 处理数值型字段变化
  const handleNumberChange = (name, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: numValue
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
  };
  
  return (
    <div className="fade-in">
      <h3 className="module-section-title">
        {isCreating ? '创建新交易策略' : `编辑 "${trading?.name}"`}
      </h3>
      
      <div className="settings-steps">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">基本信息</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">交易规则</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">风险控制</div>
        </div>
      </div>
      
      <div className="pipeline-card">
        <div className="settings-form">
          {/* 步骤 1: 基本信息 */}
          {currentStep === 1 && (
            <div className="settings-section">
              <div className="field-row">
                <label>策略名称</label>
                <div className="field-input">
                  <input 
                    type="text"
                    name="name"
                    value={settings.name}
                    onChange={handleSettingsChange}
                    placeholder="输入策略名称"
                  />
                </div>
              </div>
              
              <div className="field-row">
                <label>关联策略</label>
                <div className="field-input">
                  <select
                    name="strategyId"
                    value={settings.strategyId || ""}
                    onChange={handleSettingsChange}
                  >
                    <option value="">请选择策略</option>
                    <option value="1">动量反转策略</option>
                    <option value="2">趋势跟踪策略</option>
                    <option value="3">多因子选股策略</option>
                  </select>
                </div>
              </div>
              
              <div className="field-row">
                <label>初始资金 (元)</label>
                <div className="field-input">
                  <input
                    type="number"
                    name="settings.capital"
                    value={settings.settings?.capital || 1000000}
                    onChange={(e) => handleNumberChange('settings.capital', e.target.value)}
                    min="10000"
                    step="10000"
                  />
                  <small className="text-gray text-xs">交易策略的初始资金金额</small>
                </div>
              </div>
              
              <div className="field-row">
                <label>交易基准</label>
                <div className="field-input">
                  <select
                    name="settings.benchmark"
                    value={settings.settings?.benchmark || "000300"}
                    onChange={handleSettingsChange}
                  >
                    <option value="000300">沪深300 (000300)</option>
                    <option value="000001">上证指数 (000001)</option>
                    <option value="399001">深证成指 (399001)</option>
                    <option value="000016">上证50 (000016)</option>
                    <option value="399006">创业板指 (399006)</option>
                  </select>
                  <small className="text-gray text-xs">用于对比策略表现的参考基准</small>
                </div>
              </div>
            </div>
          )}
          
          {/* 步骤 2: 交易规则 */}
          {currentStep === 2 && (
            <div className="settings-section">
              <div className="field-row">
                <label>最大持仓数</label>
                <div className="field-input">
                  <input
                    type="number"
                    name="settings.maxPositions"
                    value={settings.settings?.maxPositions || 20}
                    onChange={(e) => handleNumberChange('settings.maxPositions', e.target.value)}
                    min="1"
                    max="100"
                  />
                  <small className="text-gray text-xs">策略同时持有的最大股票数量</small>
                </div>
              </div>
              
              <div className="field-row">
                <label>单一持仓比例上限 (%)</label>
                <div className="field-input">
                  <input
                    type="number"
                    name="settings.maxPositionSize"
                    value={settings.settings?.maxPositionSize || 20}
                    onChange={(e) => handleNumberChange('settings.maxPositionSize', e.target.value)}
                    min="1"
                    max="100"
                  />
                  <small className="text-gray text-xs">单一持仓占总资金的最大比例</small>
                </div>
              </div>
              
              <div className="field-row">
                <label>交易费率 (%)</label>
                <div className="field-input">
                  <input
                    type="number"
                    name="settings.commissionRate"
                    value={(settings.settings?.commissionRate || 0.0005) * 100}
                    onChange={(e) => handleNumberChange('settings.commissionRate', e.target.value / 100)}
                    min="0"
                    max="1"
                    step="0.01"
                  />
                  <small className="text-gray text-xs">交易费用百分比，例如0.05表示0.05%</small>
                </div>
              </div>
              
              <div className="field-row">
                <label>再平衡频率</label>
                <div className="field-input">
                  <select
                    name="settings.rebalancingFrequency"
                    value={settings.settings?.rebalancingFrequency || 'daily'}
                    onChange={handleSettingsChange}
                  >
                    <option value="daily">每日</option>
                    <option value="weekly">每周</option>
                    <option value="monthly">每月</option>
                  </select>
                  <small className="text-gray text-xs">策略重新平衡投资组合的频率</small>
                </div>
              </div>
              
              <div className="field-row">
                <label>交易时段</label>
                <div className="field-input">
                  <select
                    name="settings.tradingHours"
                    value={settings.settings?.tradingHours || 'normal'}
                    onChange={handleSettingsChange}
                  >
                    <option value="normal">正常交易时段</option>
                    <option value="openOnly">仅开盘</option>
                    <option value="closeOnly">仅收盘</option>
                  </select>
                  <small className="text-gray text-xs">策略执行交易的时段</small>
                </div>
              </div>
            </div>
          )}
          
          {/* 步骤 3: 风险控制 */}
          {currentStep === 3 && (
            <div className="settings-section">
              <div className="field-row checkbox-row">
                <label>启用风险控制</label>
                <div className="field-input">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="settings.riskControl"
                      checked={settings.settings?.riskControl || false}
                      onChange={handleSettingsChange}
                    />
                    <span className="checkbox-text">开启风险控制将强制执行止损和获利设置</span>
                  </label>
                </div>
              </div>
              
              <div className="field-row">
                <label>止损比例 (%)</label>
                <div className="field-input">
                  <input
                    type="number"
                    name="settings.stopLoss"
                    value={settings.settings?.stopLoss || 8}
                    onChange={(e) => handleNumberChange('settings.stopLoss', e.target.value)}
                    min="0"
                    max="50"
                    step="0.5"
                    disabled={!settings.settings?.riskControl}
                  />
                  <small className="text-gray text-xs">单一持仓亏损达到该比例时自动平仓</small>
                </div>
              </div>
              
              <div className="field-row">
                <label>止盈比例 (%)</label>
                <div className="field-input">
                  <input
                    type="number"
                    name="settings.takeProfit"
                    value={settings.settings?.takeProfit || 20}
                    onChange={(e) => handleNumberChange('settings.takeProfit', e.target.value)}
                    min="0"
                    max="100"
                    step="1"
                    disabled={!settings.settings?.riskControl}
                  />
                  <small className="text-gray text-xs">单一持仓收益达到该比例时自动平仓</small>
                </div>
              </div>
              
              <div className="field-note">
                <div className="note-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  风险提示
                </div>
                <p>开启实时交易功能将根据策略信号在真实市场中执行买卖操作，可能面临市场风险、流动性风险等。请确保您了解所有潜在风险并在合规的前提下操作。</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 导航按钮 */}
      <div className="backtest-actions">
        {currentStep > 1 && (
          <button 
            className="btn-tiffany"
            onClick={prevStep}
          >
            上一步
          </button>
        )}
        
        {currentStep < totalSteps && (
          <button 
            className="btn-tiffany"
            onClick={nextStep}
          >
            下一步
          </button>
        )}
        
        {currentStep === totalSteps && (
          <>
            <button 
              className="btn-tiffany"
              onClick={onCancel}
            >
              取消
            </button>
            <button 
              className="btn-tiffany"
              onClick={onSave}
            >
              {isCreating ? '部署策略' : '保存更改'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// 添加实时行情监控面板
function MarketMonitor({ trading, currentTime }) {
  const indices = [
    { code: '000001', name: '上证指数', price: 3218.42, change: 0.68, volume: '3851亿' },
    { code: '399001', name: '深证成指', price: 10523.67, change: 0.95, volume: '4127亿' },
    { code: '000300', name: '沪深300', price: 4125.83, change: 0.74, volume: '2386亿' },
    { code: '000016', name: '上证50', price: 2896.12, change: 0.52, volume: '953亿' },
    { code: '399006', name: '创业板指', price: 2153.46, change: 1.24, volume: '1246亿' }
  ];
  
  // 生成随机的实时价格变动
  const [priceUpdates, setPriceUpdates] = useState({});
  
  useEffect(() => {
    // 模拟价格小幅随机波动
    const interval = setInterval(() => {
      const updates = {};
      
      // 指数波动
      indices.forEach(index => {
        const change = (Math.random() - 0.5) * 0.05; // 小幅波动
        updates[index.code] = {
          price: index.price * (1 + change/100),
          change: index.change + change
        };
      });
      
      // 持仓股票波动
      if (trading && trading.positions) {
        trading.positions.forEach(position => {
          const change = (Math.random() - 0.45) * 0.08; // 小幅波动，略微偏向上涨
          updates[position.symbol] = {
            price: position.currentPrice * (1 + change/100),
            change: position.pnl + change
          };
        });
      }
      
      setPriceUpdates(prev => ({...prev, ...updates}));
    }, 3000); // 每3秒更新一次
    
    return () => clearInterval(interval);
  }, [trading]);
  
  // 获取股票最新价格
  const getLatestPrice = (symbol, originalPrice) => {
    if (priceUpdates[symbol]) {
      return priceUpdates[symbol].price;
    }
    return originalPrice;
  };
  
  // 获取股票最新涨跌幅
  const getLatestChange = (symbol, originalChange) => {
    if (priceUpdates[symbol]) {
      return priceUpdates[symbol].change;
    }
    return originalChange;
  };
  
  // 格式化涨跌幅
  const formatChange = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };
  
  // 判断是否是在交易时间内
  const isMarketOpen = () => {
    const now = currentTime;
    const hour = now.getHours();
    const minute = now.getMinutes();
    const day = now.getDay();
    
    // 周末市场关闭
    if (day === 0 || day === 6) return false;
    
    // 上午时段: 9:30 - 11:30
    const isMorningSession = (hour === 9 && minute >= 30) || (hour === 10) || (hour === 11 && minute <= 30);
    
    // 下午时段: 13:00 - 15:00
    const isAfternoonSession = (hour >= 13 && hour < 15);
    
    return isMorningSession || isAfternoonSession;
  };
  
  return (
    <div className="fade-in market-monitor">
      <div className="market-header">
        <h4 className="market-title">市场概览</h4>
        <div className="market-time">
          <span className={`market-status ${isMarketOpen() ? 'open' : 'closed'}`}>
            {isMarketOpen() ? '交易中' : '已收盘'}
          </span>
          <span className="current-time">{currentTime.toLocaleTimeString()}</span>
        </div>
      </div>
      
      <div className="indices-panel">
        {indices.map(index => (
          <div className="index-card" key={index.code}>
            <div className="index-name">{index.name}</div>
            <div className="index-price">
              {getLatestPrice(index.code, index.price).toFixed(2)}
            </div>
            <div className={`index-change ${getLatestChange(index.code, index.change) >= 0 ? 'positive' : 'negative'}`}>
              {formatChange(getLatestChange(index.code, index.change))}
            </div>
            <div className="index-volume">成交: {index.volume}</div>
          </div>
        ))}
      </div>
      
      {trading && trading.positions && (
        <div className="positions-realtime">
          <h4 className="market-subtitle">持仓行情</h4>
          <table className="table">
            <thead>
              <tr>
                <th>代码</th>
                <th>名称</th>
                <th>最新价</th>
                <th>涨跌幅</th>
                <th>持仓盈亏</th>
                <th>成本</th>
              </tr>
            </thead>
            <tbody>
              {trading.positions.map(position => (
                <tr key={position.symbol}>
                  <td>{position.symbol}</td>
                  <td>{position.name}</td>
                  <td className={`${getLatestPrice(position.symbol, position.currentPrice) > position.currentPrice ? 'tick-up' : getLatestPrice(position.symbol, position.currentPrice) < position.currentPrice ? 'tick-down' : ''}`}>
                    {getLatestPrice(position.symbol, position.currentPrice).toFixed(2)}
                  </td>
                  <td className={getLatestChange(position.symbol, position.pnl) >= 0 ? 'positive' : 'negative'}>
                    {formatChange(getLatestChange(position.symbol, position.pnl))}
                  </td>
                  <td className={position.pnl >= 0 ? 'positive' : 'negative'}>
                    {formatChange(position.pnl)}
                  </td>
                  <td>{position.costPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// 交易提醒组件
function TradeAlerts() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'price_alert',
      symbol: '600519',
      name: '贵州茅台',
      condition: '价格超过1850元',
      createdAt: '2025-04-19 15:30:45',
      status: 'active'
    },
    {
      id: 2,
      type: 'position_change',
      symbol: '601318',
      name: '中国平安',
      condition: '持仓盈利超过5%',
      createdAt: '2025-04-19 10:22:18',
      status: 'triggered',
      triggeredAt: '2025-04-20 09:45:22'
    },
    {
      id: 3,
      type: 'market_event',
      condition: '沪深300下跌超过1%',
      createdAt: '2025-04-18 14:37:52',
      status: 'active'
    },
    {
      id: 4,
      type: 'custom',
      condition: '日交易量超过200万',
      createdAt: '2025-04-17 11:05:33',
      status: 'active'
    }
  ]);
  
  const [newAlertOpen, setNewAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState('price_alert');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [alertCondition, setAlertCondition] = useState('');
  
  // 获取未触发警报数量
  const activeAlertsCount = alerts.filter(alert => alert.status === 'active').length;
  
  // 删除警报
  const deleteAlert = (id) => {
    if(window.confirm('确定要删除此提醒？')) {
      setAlerts(alerts.filter(alert => alert.id !== id));
    }
  };
  
  // 添加新警报
  const addNewAlert = () => {
    if (!alertCondition) {
      alert('请输入提醒条件');
      return;
    }
    
    const newAlert = {
      id: Date.now(),
      type: alertType,
      condition: alertCondition,
      createdAt: new Date().toLocaleString('zh-CN'),
      status: 'active'
    };
    
    if (alertType === 'price_alert' || alertType === 'position_change') {
      if (!selectedSymbol) {
        alert('请选择股票');
        return;
      }
      
      const symbolInfo = {
        '600519': '贵州茅台',
        '601318': '中国平安',
        '000858': '五粮液',
        '600036': '招商银行',
        '601166': '兴业银行'
      };
      
      newAlert.symbol = selectedSymbol;
      newAlert.name = symbolInfo[selectedSymbol] || '未知';
    }
    
    setAlerts([newAlert, ...alerts]);
    setNewAlertOpen(false);
    setAlertCondition('');
    setSelectedSymbol('');
  };
  
  return (
    <div className="fade-in">
      <div className="alerts-header">
        <h3 className="module-section-title">交易提醒 
          <span className="alerts-count">{activeAlertsCount}</span>
        </h3>
        <button 
          className="btn-tiffany"
          onClick={() => setNewAlertOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          添加提醒
        </button>
      </div>
      
      {alerts.length === 0 ? (
        <div className="empty-state">
          <p className="empty-description">暂无交易提醒</p>
          <button 
            className="btn-tiffany"
            onClick={() => setNewAlertOpen(true)}
          >
            添加提醒
          </button>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map(alert => (
            <div key={alert.id} className={`alert-item ${alert.status === 'triggered' ? 'triggered' : ''}`}>
              <div className="alert-icon">
                {alert.type === 'price_alert' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                )}
                {alert.type === 'position_change' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                    <polyline points="16 7 22 7 22 13"></polyline>
                  </svg>
                )}
                {alert.type === 'market_event' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                )}
                {alert.type === 'custom' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                )}
              </div>
              <div className="alert-content">
                <div className="alert-title">
                  {alert.name ? `${alert.name} (${alert.symbol})` : '市场提醒'}
                </div>
                <div className="alert-condition">
                  {alert.condition}
                </div>
                <div className="alert-meta">
                  <div className="alert-time">
                    创建于: {alert.createdAt}
                    {alert.status === 'triggered' && (
                      <span className="trigger-time">触发于: {alert.triggeredAt}</span>
                    )}
                  </div>
                  <div className="alert-status">
                    <span className={`alert-status-indicator ${alert.status}`}></span>
                    {alert.status === 'active' ? '监控中' : '已触发'}
                  </div>
                </div>
              </div>
              <div className="alert-actions">
                <button 
                  className="btn-icon" 
                  onClick={() => deleteAlert(alert.id)}
                  title="删除"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {newAlertOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>创建新提醒</h3>
              <button className="btn-icon" onClick={() => setNewAlertOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="field-row">
                <label>提醒类型</label>
                <div className="field-input">
                  <select value={alertType} onChange={(e) => setAlertType(e.target.value)}>
                    <option value="price_alert">价格提醒</option>
                    <option value="position_change">持仓变动</option>
                    <option value="market_event">市场事件</option>
                    <option value="custom">自定义</option>
                  </select>
                </div>
              </div>
              
              {(alertType === 'price_alert' || alertType === 'position_change') && (
                <div className="field-row">
                  <label>选择股票</label>
                  <div className="field-input">
                    <select value={selectedSymbol} onChange={(e) => setSelectedSymbol(e.target.value)}>
                      <option value="">请选择</option>
                      <option value="600519">贵州茅台 (600519)</option>
                      <option value="601318">中国平安 (601318)</option>
                      <option value="000858">五粮液 (000858)</option>
                      <option value="600036">招商银行 (600036)</option>
                      <option value="601166">兴业银行 (601166)</option>
                    </select>
                  </div>
                </div>
              )}
              
              <div className="field-row">
                <label>提醒条件</label>
                <div className="field-input">
                  <input 
                    type="text" 
                    value={alertCondition}
                    onChange={(e) => setAlertCondition(e.target.value)}
                    placeholder={alertType === 'price_alert' ? '例如: 价格超过1850元' : 
                              alertType === 'position_change' ? '例如: 持仓盈利超过5%' :
                              alertType === 'market_event' ? '例如: 沪深300下跌超过1%' : '自定义条件'}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-tiffany" 
                onClick={() => setNewAlertOpen(false)}
              >
                取消
              </button>
              <button 
                className="btn-tiffany"
                onClick={addNewAlert}
              >
                创建提醒
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 交易智能助手组件
function TradingAssistant({ trading }) {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    {
      role: 'assistant',
      content: '您好！我是VibeQuant交易助手，我可以帮助您管理实时交易策略、分析市场数据并执行交易指令。请问有什么可以帮您的？'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 快捷操作列表
  const quickActions = [
    { id: 1, text: '如何优化我的策略?' },
    { id: 2, text: '帮我分析当前持仓' },
    { id: 3, text: '设置止盈止损' },
    { id: 4, text: '市场今日有何变化?' }
  ];
  
  // 发送消息到助手
  const sendMessage = async () => {
    if (!message.trim()) return;
    
    // 添加用户消息到对话
    const userMessage = { role: 'user', content: message };
    setConversation([...conversation, userMessage]);
    setMessage('');
    setIsProcessing(true);
    
    // 模拟LLM处理延迟
    setTimeout(() => {
      let response;
      
      // 简单的响应逻辑，实际项目中这里应该连接到LLM-Dev Agent
      if (message.toLowerCase().includes('优化')) {
        response = {
          role: 'assistant',
          content: '根据分析，您的策略在高波动市场表现不佳。我建议：\n\n1. 调整止损设置从8%提高到10%\n2. 减少单一行业持仓比例\n3. 增加低波动性资产配比\n\n需要我帮您实施这些更改吗？'
        };
      } else if (message.toLowerCase().includes('分析')) {
        response = {
          role: 'assistant',
          content: `已分析当前${trading?.positions?.length || 5}个持仓，主要发现：\n\n- 金融板块占比过高(31.7%)\n- 贵州茅台(600519)接近技术突破点\n- 总体仓位61.4%，低于策略建议值70%\n\n建议考虑增加消费板块配置，减少金融板块敞口。`
        };
      } else if (message.toLowerCase().includes('止盈') || message.toLowerCase().includes('止损')) {
        response = {
          role: 'assistant',
          content: '已根据您的策略风险特征生成最优止盈止损方案：\n\n- 全局止损：-10%\n- 个股止损：-15%\n- 全局止盈：+25%\n- 个股止盈：根据波动率动态调整\n\n需要应用这些设置吗？'
        };
      } else if (message.toLowerCase().includes('市场') || message.toLowerCase().includes('变化')) {
        response = {
          role: 'assistant',
          content: '今日市场重要变化：\n\n1. 沪深300上涨0.74%，成交量较昨日增加12.3%\n2. 央行维持LPR利率不变\n3. 您关注的板块：消费+1.32%，科技+0.85%，金融+0.41%\n4. 外盘：恒生+0.9%，纳指期货+0.3%'
        };
      } else {
        response = {
          role: 'assistant',
          content: '我已收到您的指令。作为VibeQuant交易助手，我会将您的请求传递给Runner Agent进行处理，并在完成后向您反馈结果。有其他问题或需求请随时告诉我。'
        };
      }
      
      setConversation(prev => [...prev, response]);
      setIsProcessing(false);
    }, 1500);
  };
  
  // 使用快捷操作
  const useQuickAction = (actionText) => {
    setMessage(actionText);
  };
  
  // 处理键盘提交
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <div className="fade-in">
      <h3 className="module-section-title">交易智能助手</h3>
      
      <div className="assistant-card">
        <div className="assistant-header">
          <div className="assistant-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8V4m0 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM12 16a4 4 0 100-8 4 4 0 000 8z"></path>
              <path d="M12 8V4m0 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM12 16a4 4 0 100-8 4 4 0 000 8z"></path>
              <path d="M16 8h1.5C19.3 8 20 8.7 20 11v0c0 2.3-.7 3-2.5 3H16"></path>
              <path d="M8 8H6.5C4.7 8 4 8.7 4 11v0c0 2.3.7 3 2.5 3H8"></path>
            </svg>
          </div>
          <div className="assistant-info">
            <h4>VibeQuant 交易助手</h4>
            <p>由 LLM-Dev Agent 支持</p>
          </div>
        </div>
        
        <div className="assistant-conversation">
          {conversation.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="assistant-message">
                  {msg.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < msg.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              )}
              {msg.role === 'user' && (
                <div className="user-message">
                  <div className="message-content">{msg.content}</div>
                </div>
              )}
            </div>
          ))}
          
          {isProcessing && (
            <div className="assistant-typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
        
        <div className="assistant-quick-actions">
          {quickActions.map(action => (
            <button 
              key={action.id}
              className="quick-action-btn"
              onClick={() => useQuickAction(action.text)}
            >
              {action.text}
            </button>
          ))}
        </div>
        
        <div className="assistant-input-container">
          <textarea
            className="assistant-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的交易指令或问题..."
            rows="2"
          />
          <button 
            className="assistant-send-btn"
            onClick={sendMessage}
            disabled={isProcessing || !message.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            发送
          </button>
        </div>
      </div>
      
      <div className="assistant-integration-info">
        <h4>关于交易助手</h4>
        <p>
          VibeQuant交易助手集成了三层代理架构：
        </p>
        <ul>
          <li><strong>LLM-Dev Agent</strong>: 将自然语言转换为数据请求、因子代码和风险设置</li>
          <li><strong>Runner Agent</strong>: 在容器中执行YAML/脚本，将结果推送到UI</li>
          <li><strong>Explainer Agent</strong>: 分析结果，通过图表和叙述回答问题</li>
        </ul>
        <p>
          通过这种架构，您可以使用自然语言指令来控制和优化您的交易策略，无需编写代码或手动调整参数。
        </p>
      </div>
    </div>
  );
}
