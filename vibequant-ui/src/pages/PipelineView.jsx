import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import FinancialChart from '../components/FinancialChart';
import ChatPanel from '../components/ChatPanel';

// Material Design风格的图标组件
const DataIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28" fill="currentColor">
    <path d="M480-120q-151 0-255.5-46.5T120-280v-400q0-66 104.5-113T480-840q151 0 255.5 47T840-680v400q0 67-104.5 113T480-120Zm0-479q-138 0-226.5-39T180-720q0-43 88.5-81.5T480-840q138 0 226.5 39T780-720q0 43-88.5 81.5T480-599Zm0 199q42 0 81-4t74.5-11.5q35.5-7.5 67-18.5t57.5-25v-151q-23 14-57.5 25t-67 18.5Q600-559 561-555.5t-81 4q-42 0-82-4t-75.5-11.5Q287-575 254-586t-56-25v151q23 14 56 25t65.5 18.5Q355-409 395-405t85 5Zm0 200q42 0 81.5-4t74.5-11.5q35.5-7.5 67-18.5t57-25v-151q-22 14-56.5 25t-67 18.5Q601-359 562-355.5t-82 4q-42 0-81.5-4t-74.5-11.5q-35.5-7.5-67-18.5t-57-25v151q23 14 56.5 25t67 18.5Q359-209 398.5-205.5t81.5 5Z"/>
  </svg>
);

const FactorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28" fill="currentColor">
    <path d="M440-183v-274L200-596v-224l240 144v-121l320 192-320 192v-121l-120 71 120 73v207l-240-144L440-183Zm0-394v80l-160-96 160-96v80l320-192-320 192Z"/>
  </svg>
);

const StrategyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28" fill="currentColor">
    <path d="m388-80-20-126q-19-7-40-19t-37-25l-118 48-93-164 108-79q-2-9-2.5-20.5T185-486q0-9 .5-20.5T188-527L80-606l93-164 118 48q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-722l118-48 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-48q-16 13-36.5 25.5T592-206L572-80H388Zm48-60h88l14-112q33-8 62.5-25t53.5-41l106 43 40-72-94-69q4-17 6.5-33.5T715-486q0-17-2-33.5t-7-33.5l94-69-40-72-106 43q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 8-63.5 25.5T305-640l-106-43-40 72 94 69q-4 17-6.5 33.5T244-486q0 17 2.5 33.5T253-419l-94 69 40 72 106-43q24 24 53.5 41t62.5 25l14 112Zm44-340q53 0 90.5-37.5T608-608q0-53-37.5-90.5T480-736q-53 0-90.5 37.5T352-608q0 53 37.5 90.5T480-480Zm0-128Z"/>
  </svg>
);

const BacktestIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28" fill="currentColor">
    <path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z"/>
  </svg>
);

const LiveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28" fill="currentColor">
    <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Zm-40 120v-240h80v240h-80Z"/>
  </svg>
);

// Mock project data
const mockProjects = [
  { 
    id: 1, 
    name: 'Alpha 策略', 
    lastBacktest: '2025-04-15', 
    pnl: [5, 8, -2, 3, 7, 9, 3, -1, 4, 6], 
    status: 'live',
    tScore: 76,
    cumulativePnl: 42.5,
    investmentAmount: 100000, // Initial investment in USD
    currentValue: 142500, // Current portfolio value
    returns: 42.5, // Return percentage
    maxDrawdown: 8.2, // Maximum drawdown percentage
    volatility: 12.3, // Volatility percentage
    returnToRisk: 3.45, // Return to risk ratio
    winRate: 68, // Win rate percentage
    positions: 12, // Number of positions
    avgTradeTime: 3.2, // Average trade time in days
    annualizedReturn: 38.6, // Annualized return percentage
    calmarRatio: 4.7, // Calmar ratio
    sortinoRatio: 2.12, // Sortino ratio
    averageWin: 5.2, // Average win percentage
    averageLoss: -2.1, // Average loss percentage
    profitFactor: 2.48, // Profit factor
    recoveryFactor: 5.18, // Recovery factor
    expectancy: 2.68, // Expectancy
    dailyTurnover: 18.3 // Daily turnover percentage
  },
  { 
    id: 2, 
    name: 'Beta 动量', 
    lastBacktest: '2025-04-10', 
    pnl: [2, -1, -3, 4, 5, 6, 1, 0, -2, 3], 
    status: 'paused',
    tScore: 62,
    cumulativePnl: 15.3,
    investmentAmount: 75000, // Initial investment in USD
    currentValue: 86475, // Current portfolio value
    returns: 15.3, // Return percentage
    maxDrawdown: 12.7, // Maximum drawdown percentage
    volatility: 18.5, // Volatility percentage
    returnToRisk: 0.83, // Return to risk ratio
    winRate: 52, // Win rate percentage
    positions: 8, // Number of positions
    avgTradeTime: 4.6, // Average trade time in days
    annualizedReturn: 14.2, // Annualized return percentage
    calmarRatio: 1.12, // Calmar ratio
    sortinoRatio: 0.89, // Sortino ratio
    averageWin: 4.1, // Average win percentage
    averageLoss: -2.8, // Average loss percentage
    profitFactor: 1.46, // Profit factor
    recoveryFactor: 1.20, // Recovery factor
    expectancy: 0.63, // Expectancy
    dailyTurnover: 9.7 // Daily turnover percentage
  },
  { 
    id: 3, 
    name: 'Gamma 因子', 
    lastBacktest: '2025-03-28', 
    pnl: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    status: 'idle',
    tScore: 0,
    cumulativePnl: 0,
    investmentAmount: 50000, // Initial investment in USD
    currentValue: 50000, // Current portfolio value
    returns: 0, // Return percentage
    maxDrawdown: 0, // Maximum drawdown percentage
    volatility: 0, // Volatility percentage
    returnToRisk: 0, // Return to risk ratio
    winRate: 0, // Win rate percentage
    positions: 0, // Number of positions
    avgTradeTime: 0, // Average trade time in days
    annualizedReturn: 0, // Annualized return percentage
    calmarRatio: 0, // Calmar ratio
    sortinoRatio: 0, // Sortino ratio
    averageWin: 0, // Average win percentage
    averageLoss: 0, // Average loss percentage
    profitFactor: 0, // Profit factor
    recoveryFactor: 0, // Recovery factor
    expectancy: 0, // Expectancy
    dailyTurnover: 0 // Daily turnover percentage
  }
];

function PipelineView() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [selectedNode, setSelectedNode] = useState('data');
  const [activeTab, setActiveTab] = useState('overview');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'system', message: '欢迎！请选择一个管道节点并告诉我您需要配置或分析什么。' }
  ]);

  useEffect(() => {
    // In a real app, you'd fetch this from an API
    const foundProject = mockProjects.find(p => p.id.toString() === projectId);
    setProject(foundProject || null);
  }, [projectId]);

  if (!project) {
    return <div className="content-container">项目未找到</div>;
  }

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    // Add a system message when node changes
    setChatMessages([
      { sender: 'system', message: `已切换到${node}节点。您需要如何配置或分析它？` }
    ]);
  };

  const handleSendMessage = (messageText) => {
    if (!messageText.trim()) return;
    
    // We already added the user message in the ChatPanel component
    // Just add the system response here
    const agentResponse = { 
      sender: 'system', 
      message: `我将处理您的请求关于${selectedNode}： "${messageText}"。
      
目前，我可以帮助您：
• 获取和配置数据源
• 创建和优化因子
• 构建交易策略
• 运行回测
• 监控实时交易

您需要修改${selectedNode}的哪个方面？` 
    };

    // Add agent response with a slight delay to simulate processing
    setTimeout(() => {
      setChatMessages(prev => [...prev, agentResponse]);
    }, 600);
  };

  const getNodeIcon = (node) => {
    switch(node) {
      case 'data': return <DataIcon />;
      case 'factor': return <FactorIcon />;
      case 'strategy': return <StrategyIcon />;
      case 'backtest': return <BacktestIcon />;
      case 'live': return <LiveIcon />;
      default: return null;
    }
  };

  const renderNodeDetails = () => {
    // Special handling for Data node to potentially use more space
    if (selectedNode === 'data') {
      return (
        <div className="node-details data-node-content-area">
          <h3>数据配置和可视化</h3>
          <div className="node-detail-stats">
            <div className="stat-item">
              <span className="stat-label">来源</span>
              <span className="stat-value">雅虎财经</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">股票代码</span>
              <span className="stat-value">AAPL、MSFT、GOOG、AMZN、META</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">时间范围</span>
              <span className="stat-value">每日</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">周期</span>
              <span className="stat-value">最近两年</span>
            </div>
          </div>
          <div className="chart-container"> 
            <FinancialChart />
          </div>
          
          <div className="chat-prompt-card">
            <h5>需要修改数据源设置?</h5>
            <p>使用Agent聊天面板配置、分析或修改数据组件。</p>
            <div className="chat-prompt-examples">
              <div className="chat-prompt-example" onClick={() => {
                const examplePanel = document.querySelector('.chat-panel-input input');
                if (examplePanel) {
                  examplePanel.focus();
                  examplePanel.value = "添加新的股票代码";
                }
              }}>
                添加新的股票代码
              </div>
              <div className="chat-prompt-example" onClick={() => {
                const examplePanel = document.querySelector('.chat-panel-input input');
                if (examplePanel) {
                  examplePanel.focus();
                  examplePanel.value = "将时间范围更改为每周";
                }
              }}>
                将时间范围更改为每周
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default tabbed view for other nodes
    return (
      <div className="node-details">
        <div className="node-details-tabs">
          <div 
            className={`node-details-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            概览
          </div>
          <div 
            className={`node-details-tab ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            配置
          </div>
          <div 
            className={`node-details-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            历史
          </div>
        </div>
        
        <div className="node-details-content">
          {activeTab === 'overview' && (
            <div>
              <h4>{selectedNode.charAt(0).toUpperCase() + selectedNode.slice(1)} 概览</h4>
              
              <div className="node-detail-stats">
                {selectedNode === 'factor' && (
                  <>
                    <div className="stat-item">
                      <span className="stat-label">活跃因子</span>
                      <span className="stat-value">3</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">最高IC</span>
                      <span className="stat-value">0.42</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">最后更新</span>
                      <span className="stat-value">2025-04-15</span>
                    </div>
                  </>
                )}
                
                {selectedNode === 'strategy' && (
                  <>
                    <div className="stat-item">
                      <span className="stat-label">策略类型</span>
                      <span className="stat-value">均值回归</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">使用的因子</span>
                      <span className="stat-value">2</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">风险限制</span>
                      <span className="stat-value">5%</span>
                    </div>
                  </>
                )}
                
                {selectedNode === 'backtest' && (
                  <>
                    <div className="stat-item">
                      <span className="stat-label">夏普比率</span>
                      <span className="stat-value">1.86</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">最大回撤</span>
                      <span className="stat-value">-12.4%</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">胜率</span>
                      <span className="stat-value">68%</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">测试周期</span>
                      <span className="stat-value">2024 Q1</span>
                    </div>
                  </>
                )}
                
                {selectedNode === 'live' && (
                  <>
                    <div className="stat-item">
                      <span className="stat-label">状态</span>
                      <span className="stat-value">{project.status === 'live' ? '运行中' : project.status === 'paused' ? '暂停' : '空闲'}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">收益</span>
                      <span className="stat-value">{project.cumulativePnl}%</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">头寸</span>
                      <span className="stat-value">4 多 / 2 空</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">开始日期</span>
                      <span className="stat-value">2025-03-01</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="chat-prompt-card">
                <h5>需要修改{selectedNode}配置?</h5>
                <p>使用Agent聊天面板发送指令来配置、分析或修改该组件。</p>
                <div className="chat-prompt-examples">
                  {selectedNode === 'factor' && (
                    <>
                      <div className="chat-prompt-example" onClick={() => {
                        const examplePanel = document.querySelector('.chat-panel-input input');
                        if (examplePanel) {
                          examplePanel.focus();
                          examplePanel.value = "创建新的动量因子";
                        }
                      }}>
                        创建新的动量因子
                      </div>
                      <div className="chat-prompt-example" onClick={() => {
                        const examplePanel = document.querySelector('.chat-panel-input input');
                        if (examplePanel) {
                          examplePanel.focus();
                          examplePanel.value = "优化因子权重";
                        }
                      }}>
                        优化因子权重
                      </div>
                    </>
                  )}
                  
                  {selectedNode === 'strategy' && (
                    <>
                      <div className="chat-prompt-example" onClick={() => {
                        const examplePanel = document.querySelector('.chat-panel-input input');
                        if (examplePanel) {
                          examplePanel.focus();
                          examplePanel.value = "添加止损设置";
                        }
                      }}>
                        添加止损设置
                      </div>
                      <div className="chat-prompt-example" onClick={() => {
                        const examplePanel = document.querySelector('.chat-panel-input input');
                        if (examplePanel) {
                          examplePanel.focus();
                          examplePanel.value = "切换为趋势跟踪策略";
                        }
                      }}>
                        切换为趋势跟踪策略
                      </div>
                    </>
                  )}
                  
                  {selectedNode === 'backtest' && (
                    <>
                      <div className="chat-prompt-example" onClick={() => {
                        const examplePanel = document.querySelector('.chat-panel-input input');
                        if (examplePanel) {
                          examplePanel.focus();
                          examplePanel.value = "使用更长的回测周期";
                        }
                      }}>
                        使用更长的回测周期
                      </div>
                      <div className="chat-prompt-example" onClick={() => {
                        const examplePanel = document.querySelector('.chat-panel-input input');
                        if (examplePanel) {
                          examplePanel.focus();
                          examplePanel.value = "添加交易成本";
                        }
                      }}>
                        添加交易成本
                      </div>
                    </>
                  )}
                  
                  {selectedNode === 'live' && (
                    <>
                      <div className="chat-prompt-example" onClick={() => {
                        const examplePanel = document.querySelector('.chat-panel-input input');
                        if (examplePanel) {
                          examplePanel.focus();
                          examplePanel.value = "更改头寸规模限制";
                        }
                      }}>
                        更改头寸规模限制
                      </div>
                      <div className="chat-prompt-example" onClick={() => {
                        const examplePanel = document.querySelector('.chat-panel-input input');
                        if (examplePanel) {
                          examplePanel.focus();
                          examplePanel.value = "设置通知选项";
                        }
                      }}>
                        设置通知选项
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'config' && (
            <div>
              <h4>{selectedNode.charAt(0).toUpperCase() + selectedNode.slice(1)} 配置</h4>
              {selectedNode === 'factor' && (
                <div className="config-editor">
                  <pre className="code-block">
{`# 因子配置
factors:
  - name: momentum_20d
    type: momentum
    lookback: 20
    normalization: zscore
    
  - name: volume_trend
    type: volume
    lookback: 10
    smoothing: 3
    
  - name: mean_reversion
    type: mean_reversion
    lookback: 5
    threshold: 2.0`}
                  </pre>
                </div>
              )}
              
              {selectedNode === 'strategy' && (
                <div className="config-editor">
                  <pre className="code-block">
{`# 策略配置
strategy:
  name: alpha_momentum
  type: long_short
  
weights:
  momentum_20d: 0.4
  volume_trend: 0.25
  mean_reversion: 0.35
  
risk_controls:
  max_position_size: 0.05
  sector_exposure_limit: 0.2
  leverage: 1.0`}
                  </pre>
                </div>
              )}
              
              {selectedNode === 'backtest' && (
                <div className="config-editor">
                  <pre className="code-block">
{`# 回测配置
period:
  start: 2024-01-01
  end: 2024-03-31
  
market_impact:
  slippage: 0.001
  transaction_cost: 0.0005
  
capital: 1000000
rebalance: daily`}
                  </pre>
                </div>
              )}
              
              {selectedNode === 'live' && (
                <div className="config-editor">
                  <pre className="code-block">
{`# 实时交易配置
exchange: alpaca
api_key: "****"
api_secret: "****"

trade_settings:
  max_positions: 10
  order_type: market
  rebalance_time: "16:00 EST"
  
notifications:
  email: true
  webhook: false`}
                  </pre>
                </div>
              )}
              
              <div className="chat-prompt-card">
                <h5>需要修改这些配置?</h5>
                <p>使用Agent聊天面板发送修改指令，无需直接编辑代码。</p>
                <div className="chat-prompt-examples">
                  <div className="chat-prompt-example" onClick={() => {
                    const examplePanel = document.querySelector('.chat-panel-input input');
                    if (examplePanel) {
                      examplePanel.focus();
                      examplePanel.value = `修改${selectedNode}的配置参数`;
                    }
                  }}>
                    修改这些参数
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'history' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{ margin: 0 }}>版本历史</h4>
                <button className="btn">创建快照</button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  backgroundColor: 'var(--surface-color)',
                  padding: '12px 16px',
                  borderRadius: 'var(--border-radius-md)',
                  boxShadow: 'var(--box-shadow)'
                }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>添加了交易量因子</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Apr 15, 2025 • 10:45 AM</div>
                  </div>
                  <button className="btn">恢复</button>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  backgroundColor: 'var(--surface-color)',
                  padding: '12px 16px',
                  borderRadius: 'var(--border-radius-md)',
                  boxShadow: 'var(--box-shadow)'
                }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>优化了策略权重</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Apr 10, 2025 • 2:30 PM</div>
                  </div>
                  <button className="btn">恢复</button>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  backgroundColor: 'var(--surface-color)',
                  padding: '12px 16px',
                  borderRadius: 'var(--border-radius-md)',
                  boxShadow: 'var(--box-shadow)'
                }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>初始配置</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Apr 1, 2025 • 9:15 AM</div>
                  </div>
                  <button className="btn">恢复</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main component return
  return (
    <div className="bento-container">
      <main className="bento-main">
        <div className="bento-header">
          <Link to="/" className="bento-title">
            {project.name}
          </Link>
          <div className="project-actions">
            <span className={`project-status ${project.status}`}>
              <span className="status-indicator"></span>
              {project.status === 'live' ? '运行中' : project.status === 'paused' ? '暂停' : '空闲'}
            </span>
          </div>
        </div>

        <div className="bento-pipeline">
          <div 
            className={`bento-node ${selectedNode === 'data' ? 'active' : ''}`}
            onClick={() => handleNodeClick('data')}
          >
            <div className="bento-node-icon">{getNodeIcon('data')}</div>
            <div className="bento-node-title">数据</div>
            <div className="bento-node-status">
              <span className="status-indicator status-live"></span>
              <span>就绪</span>
            </div>
          </div>
          
          <div className="bento-connector">→</div>
          
          <div 
            className={`bento-node ${selectedNode === 'factor' ? 'active' : ''}`}
            onClick={() => handleNodeClick('factor')}
          >
            <div className="bento-node-icon">{getNodeIcon('factor')}</div>
            <div className="bento-node-title">因子</div>
            <div className="bento-node-status">
              <span className="status-indicator status-live"></span>
              <span>3 个活跃</span>
            </div>
          </div>
          
          <div className="bento-connector">→</div>
          
          <div 
            className={`bento-node ${selectedNode === 'strategy' ? 'active' : ''}`}
            onClick={() => handleNodeClick('strategy')}
          >
            <div className="bento-node-icon">{getNodeIcon('strategy')}</div>
            <div className="bento-node-title">策略</div>
            <div className="bento-node-status">
              <span className="status-indicator status-live"></span>
              <span>配置完成</span>
            </div>
          </div>
          
          <div className="bento-connector">→</div>
          
          <div 
            className={`bento-node ${selectedNode === 'backtest' ? 'active' : ''}`}
            onClick={() => handleNodeClick('backtest')}
          >
            <div className="bento-node-icon">{getNodeIcon('backtest')}</div>
            <div className="bento-node-title">回测</div>
            <div className="bento-node-status">
              <span className="status-indicator status-live"></span>
              <span>夏普比率 1.86</span>
            </div>
          </div>
          
          <div className="bento-connector">→</div>
          
          <div 
            className={`bento-node ${selectedNode === 'live' ? 'active' : ''}`}
            onClick={() => handleNodeClick('live')}
          >
            <div className="bento-node-icon">{getNodeIcon('live')}</div>
            <div className="bento-node-title">实时交易</div>
            <div className="bento-node-status">
              <span className={`status-indicator status-${project.status}`}></span>
              <span>{project.status === 'live' ? '运行中' : project.status === 'paused' ? '暂停' : '空闲'}</span>
            </div>
          </div>
        </div>

        <div className="bento-content">
          {renderNodeDetails()}
        </div>
      </main>

      <aside className="bento-chat-area">
        <ChatPanel 
          initialMessages={chatMessages} 
          onSendMessage={handleSendMessage} 
          selectedNode={selectedNode}
        />
      </aside>
    </div>
  );
}

export default PipelineView;
