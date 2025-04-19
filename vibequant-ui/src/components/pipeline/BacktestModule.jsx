import React, { useState } from 'react';
import './pipeline.css';

// 模拟回测结果数据
const initialBacktests = [
  {
    id: 1,
    name: "动量策略回测",
    strategyId: 1,
    period: {
      startDate: "2024-01-01",
      endDate: "2024-03-31"
    },
    status: "completed",
    results: {
      totalReturn: 24.5,
      annualReturn: 98.0,
      sharpeRatio: 1.86,
      maxDrawdown: -12.4,
      winRate: 68,
      sortino: 2.3,
      volatility: 18.2,
      beta: 0.85,
      alpha: 12.3,
      informationRatio: 0.92
    },
    settings: {
      initialCapital: 1000000,
      commissionRate: 0.001,
      slippageModel: "fixed",
      slippageValue: 0.001,
      rebalancingFrequency: "daily"
    }
  },
  {
    id: 2,
    name: "价值投资回测",
    strategyId: 2,
    period: {
      startDate: "2024-01-01",
      endDate: "2024-06-30"
    },
    status: "completed",
    results: {
      totalReturn: 18.2,
      annualReturn: 36.4,
      sharpeRatio: 1.43,
      maxDrawdown: -8.6,
      winRate: 72,
      sortino: 1.9,
      volatility: 12.5,
      beta: 0.62,
      alpha: 9.8,
      informationRatio: 0.88
    },
    settings: {
      initialCapital: 2000000,
      commissionRate: 0.0008,
      slippageModel: "fixed",
      slippageValue: 0.0005,
      rebalancingFrequency: "weekly"
    }
  }
];

// 全局状态管理
const globalBacktestState = {
  backtests: [...initialBacktests]
};

export function BacktestModule() {
  const [backtests, setBacktests] = useState(globalBacktestState.backtests);
  const [selectedBacktest, setSelectedBacktest] = useState(backtests[0] || null);
  const [activeTab, setActiveTab] = useState('performance');
  const [isCreating, setIsCreating] = useState(false);
  
  // 新建回测设置
  const [newBacktestSettings, setNewBacktestSettings] = useState({
    name: "",
    strategyId: "",
    period: {
      startDate: "",
      endDate: ""
    },
    settings: {
      initialCapital: 1000000,
      commissionRate: 0.001,
      slippageValue: 0.001,
      rebalancingFrequency: "daily"
    }
  });

  // 创建新回测
  const createNewBacktest = () => {
    setIsCreating(true);
    setActiveTab('settings');
    setSelectedBacktest(null);
    
    // 设置默认值
    const today = new Date();
    const startDate = new Date();
    startDate.setMonth(today.getMonth() - 3);
    
    setNewBacktestSettings({
      name: "新回测",
      strategyId: "",
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      },
      settings: {
        initialCapital: 1000000,
        commissionRate: 0.001,
        slippageValue: 0.001,
        rebalancingFrequency: "daily"
      }
    });
  };

  // 运行回测
  const runBacktest = () => {
    if (isCreating) {
      // 创建新回测
      const newBacktest = {
        id: Date.now(),
        name: newBacktestSettings.name,
        strategyId: parseInt(newBacktestSettings.strategyId) || 1,
        period: { ...newBacktestSettings.period },
        status: "completed", // 假设回测立即完成
        settings: { ...newBacktestSettings.settings },
        results: generateMockResults() // 生成模拟结果
      };
      
      const updatedBacktests = [newBacktest, ...backtests];
      setBacktests(updatedBacktests);
      globalBacktestState.backtests = updatedBacktests;
      
      setSelectedBacktest(newBacktest);
      setIsCreating(false);
      setActiveTab('performance');
    } else {
      // 执行已有回测
      if (selectedBacktest) {
        const updatedBacktest = {
          ...selectedBacktest,
          results: generateMockResults()
        };
        
        const updatedBacktests = backtests.map(b => 
          b.id === updatedBacktest.id ? updatedBacktest : b
        );
        
        setBacktests(updatedBacktests);
        globalBacktestState.backtests = updatedBacktests;
        setSelectedBacktest(updatedBacktest);
        setActiveTab('performance');
      }
    }
  };
  
  // 生成模拟回测结果
  const generateMockResults = () => {
    return {
      totalReturn: parseFloat((Math.random() * 40 - 10).toFixed(1)),
      annualReturn: parseFloat((Math.random() * 80 - 20).toFixed(1)),
      sharpeRatio: parseFloat((Math.random() * 2.5).toFixed(2)),
      maxDrawdown: parseFloat((-Math.random() * 25).toFixed(1)),
      winRate: Math.floor(Math.random() * 40 + 40),
      sortino: parseFloat((Math.random() * 3).toFixed(1)),
      volatility: parseFloat((Math.random() * 25 + 5).toFixed(1)),
      beta: parseFloat((Math.random() * 1.5).toFixed(2)),
      alpha: parseFloat((Math.random() * 15).toFixed(1)),
      informationRatio: parseFloat((Math.random() * 1.2).toFixed(2))
    };
  };
  
  // 处理设置变化
  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [category, field] = name.split('.');
      setNewBacktestSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: value
        }
      }));
    } else {
      setNewBacktestSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // 处理数值型字段变化
  const handleNumberChange = (name, value) => {
    if (name.includes('.')) {
      const [category, field] = name.split('.');
      setNewBacktestSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: parseFloat(value)
        }
      }));
    } else {
      setNewBacktestSettings(prev => ({
        ...prev,
        [name]: parseFloat(value)
      }));
    }
  };
  
  // 格式化百分比
  const formatPercent = (value) => {
    const prefix = value > 0 ? '+' : '';
    return `${prefix}${value}%`;
  };

  // 删除回测
  const deleteBacktest = (id) => {
    const updatedBacktests = backtests.filter(b => b.id !== id);
    setBacktests(updatedBacktests);
    globalBacktestState.backtests = updatedBacktests;
    
    if (selectedBacktest && selectedBacktest.id === id) {
      setSelectedBacktest(updatedBacktests[0] || null);
    }
  };

  return (
    <div className="pipeline-module">
      <div className="module-toolbar">
        <div className="toolbar-tabs">
          <button 
            className={`toolbar-tab ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => selectedBacktest && setActiveTab('performance')}
            disabled={!selectedBacktest}
          >
            业绩分析
          </button>
          <button 
            className={`toolbar-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            回测设置
          </button>
        </div>
        <div className="toolbar-spacer"></div>
        <button className="btn btn-primary" onClick={createNewBacktest}>
          新建回测
        </button>
      </div>

      <div className="module-content">
        <div className="backtest-grid">
          <div className="backtest-sidebar">
            {backtests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray mb-3">还没有回测记录</p>
                <p className="text-sm text-gray">点击"新建回测"按钮开始</p>
              </div>
            ) : (
              <div className="item-list">
                {backtests.map(backtest => (
                  <div
                    key={backtest.id}
                    className={`backtest-item ${selectedBacktest?.id === backtest.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedBacktest(backtest);
                      setIsCreating(false);
                      setActiveTab('performance');
                    }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{backtest.name}</span>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBacktest(backtest.id);
                        }}
                      >
                        删除
                      </button>
                    </div>
                    <div className="text-xs text-gray mb-1">
                      {backtest.period.startDate} 至 {backtest.period.endDate}
                    </div>
                    <div className={`text-sm font-medium ${backtest.results.totalReturn >= 0 ? 'text-success' : 'text-error'}`}>
                      {formatPercent(backtest.results.totalReturn)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="backtest-main">
            {activeTab === 'performance' && selectedBacktest && (
              <BacktestPerformance backtest={selectedBacktest} formatPercent={formatPercent} />
            )}
            
            {activeTab === 'settings' && (
              <BacktestSettings 
                isCreating={isCreating}
                settings={isCreating ? newBacktestSettings : selectedBacktest?.settings}
                onSettingsChange={handleSettingsChange}
                onNumberChange={handleNumberChange}
                onRun={runBacktest}
                onCancel={() => {
                  if (isCreating && selectedBacktest) {
                    setIsCreating(false);
                    setActiveTab('performance');
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 回测业绩组件
function BacktestPerformance({ backtest, formatPercent }) {
  const { results } = backtest;
  
  const isProfitable = results.totalReturn >= 0;
  
  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{backtest.name}</h3>
        <div className="text-sm text-gray">
          {backtest.period.startDate} 至 {backtest.period.endDate}
        </div>
      </div>
      
      <div className="pipeline-card mb-4">
        <div className="pipeline-card-content">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-xs text-gray">总收益率</span>
              <div className={`text-2xl font-bold ${isProfitable ? 'text-success' : 'text-error'}`}>
                {formatPercent(results.totalReturn)}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray">年化收益率</span>
              <div className={`text-2xl font-bold ${results.annualReturn >= 0 ? 'text-success' : 'text-error'}`}>
                {formatPercent(results.annualReturn)}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray">最大回撤</span>
              <div className="text-2xl font-bold text-error">
                {formatPercent(results.maxDrawdown)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pipeline-card mb-4">
        <div className="pipeline-card-content">
          <h4 className="text-md font-medium mb-3">绩效指标</h4>
          <div className="metrics-row">
            <MetricBox name="夏普比率" value={results.sharpeRatio.toFixed(2)} />
            <MetricBox name="索提诺比率" value={results.sortino.toFixed(2)} />
            <MetricBox name="信息比率" value={results.informationRatio.toFixed(2)} />
            <MetricBox name="Alpha" value={`${results.alpha.toFixed(1)}%`} valueClass={results.alpha >= 0 ? 'positive' : 'negative'} />
            <MetricBox name="Beta" value={results.beta.toFixed(2)} />
            <MetricBox name="波动率" value={`${results.volatility.toFixed(1)}%`} />
            <MetricBox name="胜率" value={`${results.winRate}%`} />
          </div>
        </div>
      </div>
      
      <div className="pipeline-card">
        <div className="pipeline-card-content">
          <h4 className="text-md font-medium mb-3">回测设置</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray">初始资金</span>
              <div className="text-md">¥{backtest.settings.initialCapital.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-xs text-gray">再平衡频率</span>
              <div className="text-md">
                {{
                  'daily': '每日',
                  'weekly': '每周',
                  'monthly': '每月'
                }[backtest.settings.rebalancingFrequency] || backtest.settings.rebalancingFrequency}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray">交易费率</span>
              <div className="text-md">{(backtest.settings.commissionRate * 100).toFixed(2)}%</div>
            </div>
            <div>
              <span className="text-xs text-gray">滑点设置</span>
              <div className="text-md">{(backtest.settings.slippageValue * 100).toFixed(2)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 指标盒子组件
function MetricBox({ name, value, valueClass }) {
  return (
    <div className="metric-box">
      <div className="metric-name">{name}</div>
      <div className={`metric-value ${valueClass || ''}`}>{value}</div>
    </div>
  );
}

// 回测设置组件
function BacktestSettings({ isCreating, settings, onSettingsChange, onNumberChange, onRun, onCancel }) {
  if (!settings) {
    return <div className="text-gray">请选择回测或创建新回测</div>;
  }
  
  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{isCreating ? '创建新回测' : '修改回测设置'}</h3>
      </div>
      
      <div className="pipeline-card">
        <div className="pipeline-card-content">
          <div className="field-row">
            <label>回测名称</label>
            <div className="field-input">
              <input
                type="text"
                name="name"
                value={settings.name || ''}
                onChange={onSettingsChange}
                required
              />
            </div>
          </div>
          
          {isCreating && (
            <div className="field-row">
              <label>选择策略</label>
              <div className="field-input">
                <select
                  name="strategyId"
                  value={settings.strategyId || ''}
                  onChange={onSettingsChange}
                  required
                >
                  <option value="">请选择策略</option>
                  <option value="1">动量策略</option>
                  <option value="2">多因子策略</option>
                </select>
              </div>
            </div>
          )}
          
          <div className="field-row">
            <label>起始日期</label>
            <div className="field-input">
              <input
                type="date"
                name="period.startDate"
                value={settings.period?.startDate || ''}
                onChange={onSettingsChange}
                required
              />
            </div>
          </div>
          
          <div className="field-row">
            <label>结束日期</label>
            <div className="field-input">
              <input
                type="date"
                name="period.endDate"
                value={settings.period?.endDate || ''}
                onChange={onSettingsChange}
                required
              />
            </div>
          </div>
          
          <div className="field-row">
            <label>初始资金</label>
            <div className="field-input">
              <input
                type="number"
                name="settings.initialCapital"
                value={settings.settings?.initialCapital || 1000000}
                onChange={(e) => onNumberChange('settings.initialCapital', e.target.value)}
                min="10000"
                step="10000"
              />
            </div>
          </div>
          
          <div className="field-row">
            <label>交易费率 (%)</label>
            <div className="field-input">
              <input
                type="number"
                name="settings.commissionRate"
                value={(settings.settings?.commissionRate || 0.001) * 100}
                onChange={(e) => onNumberChange('settings.commissionRate', e.target.value / 100)}
                min="0"
                max="1"
                step="0.01"
              />
              <small className="text-gray text-xs">交易费用百分比，例如0.1表示0.1%</small>
            </div>
          </div>
          
          <div className="field-row">
            <label>滑点设置 (%)</label>
            <div className="field-input">
              <input
                type="number"
                name="settings.slippageValue"
                value={(settings.settings?.slippageValue || 0.001) * 100}
                onChange={(e) => onNumberChange('settings.slippageValue', e.target.value / 100)}
                min="0"
                max="1"
                step="0.01"
              />
              <small className="text-gray text-xs">设定成交价与预期价格的差异百分比</small>
            </div>
          </div>
          
          <div className="field-row">
            <label>再平衡频率</label>
            <div className="field-input">
              <select
                name="settings.rebalancingFrequency"
                value={settings.settings?.rebalancingFrequency || 'daily'}
                onChange={onSettingsChange}
              >
                <option value="daily">每日</option>
                <option value="weekly">每周</option>
                <option value="monthly">每月</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 justify-end mt-4">
        {!isCreating && (
          <button 
            className="btn btn-secondary"
            onClick={onCancel}
          >
            取消
          </button>
        )}
        <button 
          className="btn btn-primary"
          onClick={onRun}
        >
          {isCreating ? '创建并运行' : '更新并重新运行'}
        </button>
      </div>
    </div>
  );
}
