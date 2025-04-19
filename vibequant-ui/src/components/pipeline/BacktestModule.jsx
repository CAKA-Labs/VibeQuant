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
  const [isRunning, setIsRunning] = useState(false);
  
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
      name: "动量反转策略回测",
      strategyId: "1",
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
    setIsRunning(true);
    
    // 模拟回测过程延迟
    setTimeout(() => {
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
      setIsRunning(false);
    }, 2000);
  };
  
  // 生成模拟回测结果
  const generateMockResults = () => {
    // 生成随机但合理的回测结果
    const totalReturn = Math.random() * 40 - 5; // -5% to 35%
    const annualReturn = totalReturn * 4; // 简化的年化计算
    const sharpeRatio = 0.8 + Math.random() * 1.7; // 0.8 to 2.5
    const maxDrawdown = -(Math.random() * 15 + 5); // -5% to -20%
    const winRate = Math.floor(Math.random() * 30 + 50); // 50% to 80%
    
    return {
      totalReturn,
      annualReturn,
      sharpeRatio,
      maxDrawdown,
      winRate,
      sortino: sharpeRatio * 0.8 + Math.random() * 0.4,
      volatility: Math.random() * 15 + 8, // 8% to 23%
      beta: 0.5 + Math.random() * 0.8, // 0.5 to 1.3
      alpha: annualReturn * 0.3 * (Math.random() > 0.3 ? 1 : -1), // 正或负的alpha
      informationRatio: Math.random() * 1.2
    };
  };

  // 处理设置变化
  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    
    // 处理嵌套属性 (如 'period.startDate')
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewBacktestSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
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
    // 确保值是数字
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    // 处理嵌套属性
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewBacktestSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: numValue
        }
      }));
    } else {
      setNewBacktestSettings(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
  };

  // 格式化百分比
  const formatPercent = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };
  
  // 删除回测
  const deleteBacktest = (id) => {
    if (window.confirm('确定要删除这个回测吗？')) {
      const updatedBacktests = backtests.filter(b => b.id !== id);
      setBacktests(updatedBacktests);
      globalBacktestState.backtests = updatedBacktests;
      
      if (selectedBacktest && selectedBacktest.id === id) {
        setSelectedBacktest(updatedBacktests[0] || null);
        setActiveTab('performance');
      }
    }
  };
  
  // 选择回测
  const selectBacktest = (backtest) => {
    setSelectedBacktest(backtest);
    setActiveTab('performance');
    setIsCreating(false);
  };

  return (
    <div className="pipeline-module">
      <div className="module-toolbar">
        <div className="toolbar-tabs">
          <button 
            className={`toolbar-tab ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
            disabled={isCreating || !selectedBacktest}
          >
            性能分析
          </button>
          <button 
            className={`toolbar-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            disabled={!selectedBacktest && !isCreating}
          >
            回测设置
          </button>
          <button 
            className={`toolbar-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            历史回测
          </button>
        </div>
        <div className="toolbar-spacer"></div>
        <button 
          className="btn-tiffany"
          onClick={createNewBacktest}
          disabled={isCreating || isRunning}
        >
          新建回测
        </button>
      </div>

      <div className="module-content">
        {isRunning && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-text">运行回测中...</div>
          </div>
        )}
        
        {activeTab === 'performance' && (
          selectedBacktest ? (
            <BacktestPerformance 
              backtest={selectedBacktest} 
              formatPercent={formatPercent} 
            />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </div>
              <h3 className="empty-title">暂无回测数据</h3>
              <p className="empty-description">点击"新建回测"按钮开始创建</p>
              <button 
                className="btn-tiffany"
                onClick={createNewBacktest}
              >
                新建回测
              </button>
            </div>
          )
        )}
        
        {activeTab === 'settings' && (
          isCreating || selectedBacktest ? (
            <BacktestSettings 
              isCreating={isCreating}
              settings={isCreating ? newBacktestSettings : selectedBacktest}
              onSettingsChange={handleSettingsChange}
              onNumberChange={handleNumberChange}
              onRun={runBacktest}
              onCancel={() => {
                if (selectedBacktest) {
                  setActiveTab('performance');
                } else {
                  setIsCreating(false);
                  setActiveTab('history');
                }
              }}
            />
          ) : (
            <div className="text-center text-gray py-8">请选择回测或创建新回测</div>
          )
        )}
        
        {activeTab === 'history' && (
          <div className="fade-in">
            <h3 className="module-section-title">历史回测</h3>
            
            {backtests.length === 0 ? (
              <div className="empty-state">
                <p className="empty-description">暂无回测记录</p>
                <button 
                  className="btn-tiffany"
                  onClick={createNewBacktest}
                >
                  新建回测
                </button>
              </div>
            ) : (
              <div className="pipeline-card">
                <table className="table">
                  <thead>
                    <tr>
                      <th>回测名称</th>
                      <th>时间范围</th>
                      <th>收益</th>
                      <th>夏普比率</th>
                      <th>状态</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backtests.map(backtest => (
                      <tr 
                        key={backtest.id}
                        className={selectedBacktest && selectedBacktest.id === backtest.id ? 'selected-row' : ''}
                      >
                        <td>{backtest.name}</td>
                        <td>{backtest.period.startDate} 至 {backtest.period.endDate}</td>
                        <td className={backtest.results.totalReturn >= 0 ? 'text-success' : 'text-error'}>
                          {formatPercent(backtest.results.totalReturn)}
                        </td>
                        <td>{backtest.results.sharpeRatio.toFixed(2)}</td>
                        <td>
                          <span className={`tag tag-${backtest.status === 'completed' ? 'success' : 'warning'}`}>
                            {backtest.status === 'completed' ? '已完成' : '进行中'}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button 
                              className="btn-tiffany"
                              onClick={() => selectBacktest(backtest)}
                              title="查看详情"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </button>
                            <button 
                              className="btn-tiffany-danger"
                              onClick={() => deleteBacktest(backtest.id)}
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
      </div>
    </div>
  );
}

// 回测业绩组件
function BacktestPerformance({ backtest, formatPercent }) {
  if (!backtest) return null;
  
  const { results } = backtest;
  
  return (
    <div className="fade-in">
      <h3 className="module-section-title">{backtest.name} 回测结果</h3>
      
      <div className="backtest-chart-container">
        <BacktestChart backtest={backtest} />
      </div>
      
      <div className="pipeline-card">
        <div className="pipeline-card-header">
          <h4>绩效摘要</h4>
        </div>
        <div className="pipeline-card-content">
          <div className="metrics-grid">
            <div className="metrics-section">
              <h5>收益指标</h5>
              <div className="metrics-group">
                <MetricBox 
                  name="总收益" 
                  value={formatPercent(results.totalReturn)} 
                  valueClass={results.totalReturn >= 0 ? 'positive' : 'negative'} 
                />
                <MetricBox 
                  name="年化收益" 
                  value={formatPercent(results.annualReturn)} 
                  valueClass={results.annualReturn >= 0 ? 'positive' : 'negative'} 
                />
                <MetricBox 
                  name="Alpha" 
                  value={formatPercent(results.alpha)} 
                  valueClass={results.alpha >= 0 ? 'positive' : 'negative'} 
                />
              </div>
            </div>
            
            <div className="metrics-section">
              <h5>风险指标</h5>
              <div className="metrics-group">
                <MetricBox 
                  name="最大回撤" 
                  value={formatPercent(results.maxDrawdown)} 
                  valueClass="negative" 
                />
                <MetricBox 
                  name="波动率" 
                  value={formatPercent(results.volatility)} 
                  valueClass="neutral" 
                />
                <MetricBox 
                  name="Beta" 
                  value={results.beta.toFixed(2)} 
                  valueClass="neutral" 
                />
              </div>
            </div>
            
            <div className="metrics-section">
              <h5>风险调整收益</h5>
              <div className="metrics-group">
                <MetricBox 
                  name="夏普比率" 
                  value={results.sharpeRatio.toFixed(2)} 
                  valueClass={results.sharpeRatio >= 1 ? 'positive' : 'neutral'} 
                />
                <MetricBox 
                  name="索提诺比率" 
                  value={results.sortino.toFixed(2)} 
                  valueClass={results.sortino >= 1 ? 'positive' : 'neutral'} 
                />
                <MetricBox 
                  name="信息比率" 
                  value={results.informationRatio.toFixed(2)} 
                  valueClass={results.informationRatio >= 0.5 ? 'positive' : 'neutral'} 
                />
              </div>
            </div>
            
            <div className="metrics-section">
              <h5>交易统计</h5>
              <div className="metrics-group">
                <MetricBox 
                  name="胜率" 
                  value={`${results.winRate}%`} 
                  valueClass={results.winRate >= 50 ? 'positive' : 'negative'} 
                />
                <MetricBox name="初始资金" value={`¥${backtest.settings.initialCapital.toLocaleString()}`} valueClass="neutral" />
                <MetricBox name="交易频率" value={formatRebalancingFrequency(backtest.settings.rebalancingFrequency)} valueClass="neutral" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 回测图表组件
function BacktestChart({ backtest }) {
  if (!backtest) return null;
  
  // 假设我们有一些模拟数据
  const chartData = generateChartData(backtest);
  
  return (
    <div className="backtest-chart">
      <div className="backtest-chart-header">
        <div>
          <div className="chart-title">累积收益曲线</div>
          <div className="chart-subtitle">
            {backtest.period.startDate} 至 {backtest.period.endDate}
          </div>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color strategy-color"></div>
            <div>策略</div>
          </div>
          <div className="legend-item">
            <div className="legend-color benchmark-color"></div>
            <div>基准</div>
          </div>
        </div>
      </div>
      
      <div className="chart-canvas" style={{ height: '240px', position: 'relative' }}>
        {/* 实际项目中应该使用echarts或其他图表库 */}
        <div className="chart-placeholder">
          <svg width="100%" height="100%" viewBox="0 0 800 240" preserveAspectRatio="none">
            <defs>
              <linearGradient id="strategyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(10, 186, 181, 0.2)" />
                <stop offset="100%" stopColor="rgba(10, 186, 181, 0)" />
              </linearGradient>
            </defs>
            {/* 基准线 */}
            <polyline
              points={generateBenchmarkPoints(chartData, 800, 240)}
              fill="none"
              stroke="#ccc"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            
            {/* 策略收益曲线区域 */}
            <path
              d={generateAreaPath(chartData, 800, 240)}
              fill="url(#strategyGradient)"
            />
            
            {/* 策略收益曲线 */}
            <polyline
              points={generateStrategyPoints(chartData, 800, 240)}
              fill="none"
              stroke="#0abab5"
              strokeWidth="3"
            />
            
            {/* 最大回撤标记 */}
            <line
              x1={chartData.maxDrawdownStart * 800 / chartData.days}
              y1={240 - (chartData.values[chartData.maxDrawdownStart] - chartData.min) * 220 / (chartData.max - chartData.min)}
              x2={chartData.maxDrawdownEnd * 800 / chartData.days}
              y2={240 - (chartData.values[chartData.maxDrawdownEnd] - chartData.min) * 220 / (chartData.max - chartData.min)}
              stroke="#ea4335"
              strokeWidth="2"
              strokeDasharray="3,3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// 辅助函数：生成图表数据
function generateChartData(backtest) {
  // 基于回测性能生成60天的模拟曲线
  const days = 60;
  const values = [];
  const benchmarkValues = [];
  
  // 使用回测结果创建合理的曲线
  const totalReturn = backtest.results.totalReturn / 100;
  const volatility = backtest.results.volatility / 100 / Math.sqrt(252) * Math.sqrt(days);
  const benchmarkReturn = totalReturn * 0.7; // 基准回报假设为策略的70%
  
  // 初始值
  values.push(100);
  benchmarkValues.push(100);
  
  // 生成每日收益曲线
  for (let i = 1; i < days; i++) {
    // 添加一些随机波动
    const noise = (Math.random() - 0.5) * volatility * 2;
    const dailyReturn = (totalReturn / days) + noise;
    values.push(values[i-1] * (1 + dailyReturn));
    
    // 基准曲线
    const benchmarkNoise = (Math.random() - 0.5) * volatility * 1.3;
    const benchmarkDailyReturn = (benchmarkReturn / days) + benchmarkNoise;
    benchmarkValues.push(benchmarkValues[i-1] * (1 + benchmarkDailyReturn));
  }
  
  // 找到最大回撤时间点
  let maxDrawdown = 0;
  let maxDrawdownStart = 0;
  let maxDrawdownEnd = 0;
  let peak = values[0];
  
  for (let i = 1; i < values.length; i++) {
    if (values[i] > peak) {
      peak = values[i];
    }
    
    const drawdown = (peak - values[i]) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
      maxDrawdownEnd = i;
      
      // 找到这个回撤的开始点（峰值点）
      for (let j = i; j >= 0; j--) {
        if (values[j] === peak) {
          maxDrawdownStart = j;
          break;
        }
      }
    }
  }
  
  return {
    days,
    values,
    benchmarkValues,
    min: Math.min(...values, ...benchmarkValues) * 0.95,
    max: Math.max(...values, ...benchmarkValues) * 1.05,
    maxDrawdownStart,
    maxDrawdownEnd
  };
}

// 辅助函数：生成策略曲线点
function generateStrategyPoints(chartData, width, height) {
  const { values, min, max, days } = chartData;
  
  return values.map((value, index) => {
    const x = (index / (days - 1)) * width;
    const y = height - ((value - min) / (max - min) * (height - 20));
    return `${x},${y}`;
  }).join(' ');
}

// 辅助函数：生成基准曲线点
function generateBenchmarkPoints(chartData, width, height) {
  const { benchmarkValues, min, max, days } = chartData;
  
  return benchmarkValues.map((value, index) => {
    const x = (index / (days - 1)) * width;
    const y = height - ((value - min) / (max - min) * (height - 20));
    return `${x},${y}`;
  }).join(' ');
}

// 辅助函数：生成面积图路径
function generateAreaPath(chartData, width, height) {
  const { values, min, max, days } = chartData;
  
  let path = `M0,${height} `;
  
  values.forEach((value, index) => {
    const x = (index / (days - 1)) * width;
    const y = height - ((value - min) / (max - min) * (height - 20));
    path += `L${x},${y} `;
  });
  
  path += `L${width},${height} Z`;
  return path;
}

// 辅助函数：格式化再平衡频率
function formatRebalancingFrequency(freq) {
  switch (freq) {
    case 'daily': return '每日';
    case 'weekly': return '每周';
    case 'monthly': return '每月';
    default: return freq;
  }
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
  const [currentStep, setCurrentStep] = useState(1);
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

  return (
    <div className="fade-in">
      <h3 className="module-section-title">
        {isCreating ? '创建新回测' : '编辑回测设置'}
      </h3>
      
      {/* 步骤指示器 */}
      <div className="backtest-steps">
        <div className={`backtest-step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className={`step-number ${currentStep >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step-label ${currentStep >= 1 ? 'active' : ''}`}>基本信息</div>
        </div>
        <div className={`backtest-step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className={`step-number ${currentStep >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step-label ${currentStep >= 2 ? 'active' : ''}`}>时间范围</div>
        </div>
        <div className={`backtest-step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className={`step-number ${currentStep >= 3 ? 'active' : ''}`}>3</div>
          <div className={`step-label ${currentStep >= 3 ? 'active' : ''}`}>交易设置</div>
        </div>
      </div>
      
      {/* 步骤内容 */}
      <div className="pipeline-card settings-card">
        <div className="pipeline-card-content">
          {/* 第一步：基本信息 */}
          {currentStep === 1 && (
            <div className="settings-section">
              <h4 className="settings-section-title">基本信息</h4>
              
              <div className="field-row">
                <label>回测名称</label>
                <div className="field-input">
                  <input
                    type="text"
                    name="name"
                    value={settings.name || ''}
                    onChange={onSettingsChange}
                    placeholder="输入回测名称，如：动量策略回测"
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
                      <option value="1">动量反转策略</option>
                      <option value="2">趋势跟踪策略</option>
                      <option value="3">多因子选股策略</option>
                      <option value="4">高频统计套利</option>
                      <option value="5">波动率交易策略</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* 第二步：时间范围 */}
          {currentStep === 2 && (
            <div className="settings-section">
              <h4 className="settings-section-title">回测时间范围</h4>
              
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
                  <small className="text-gray text-xs">回测将包含起始日期和结束日期</small>
                </div>
              </div>
            </div>
          )}
          
          {/* 第三步：交易设置 */}
          {currentStep === 3 && (
            <div className="settings-section">
              <h4 className="settings-section-title">交易设置</h4>
              
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
                  <small className="text-gray text-xs">回测初始资金金额（元）</small>
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
                  <small className="text-gray text-xs">策略重新平衡投资组合的频率</small>
                </div>
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
            {!isCreating && (
              <button 
                className="btn-tiffany"
                onClick={onCancel}
              >
                取消
              </button>
            )}
            <button 
              className="btn-tiffany"
              onClick={onRun}
            >
              {isCreating ? '创建并运行' : '更新并重新运行'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function BacktestRunner({ settings, onComplete, onCancel }) {
  // ... (State for progress, logs, etc.)
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm fade-in">
      <h3>运行回测</h3>
      {/* Progress bar, logs display */} 
      <div className="flex justify-end space-x-3 mt-4">
        <button onClick={onCancel} className="btn-tiffany-danger">取消运行</button>
      </div>
    </div>
  );
}

// ... (Other components)
