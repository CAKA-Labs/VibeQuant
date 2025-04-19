import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import FinancialChart from '../components/FinancialChart';
import ChatPanel from '../components/ChatPanel';

// Material Design风格的图标组件
const DataIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28" fill="currentColor">
    <path d="M480-120q-151 0-255.5-46.5T120-280v-400q0-66 104.5-113T480-840q151 0 255.5 47T840-680v400q0 67-104.5 113.5T480-120Zm0-479q-138 0-226.5-39T180-720q0-43 88.5-81.5T480-840q138 0 226.5 39T780-720q0 43-88.5 81.5T480-599Zm0 199q42 0 81-4t74.5-11.5q35.5-7.5 67-18.5t57.5-25v-151q-23 14-57.5 25t-67 18.5Q600-559 561-555.5t-81 4q-42 0-82-4t-75.5-11.5Q287-575 254-586t-56-25v151q23 14 56 25t65.5 18.5Q355-409 395-405t85 5Zm0 200q42 0 81.5-4t74.5-11.5q35.5-7.5 67-18.5t57-25v-151q-22 14-56.5 25t-67 18.5Q601-359 562-355.5t-82 4q-42 0-81.5-4t-74.5-11.5q-35.5-7.5-67-18.5t-57-25v151q23 14 56.5 25t67 18.5Q359-209 398.5-205.5t81.5 5Z"/>
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
    name: 'Alpha Strategy', 
    lastBacktest: '2025-04-15', 
    pnl: [5, 8, -2, 3, 7, 9, 3, -1, 4, 6], 
    status: 'live',
    tScore: 76,
    cumulativePnl: 42.5
  },
  { 
    id: 2, 
    name: 'Beta Momentum', 
    lastBacktest: '2025-04-10', 
    pnl: [2, -1, -3, 4, 5, 6, 1, 0, -2, 3], 
    status: 'paused',
    tScore: 62,
    cumulativePnl: 15.3
  },
  { 
    id: 3, 
    name: 'Gamma Factor', 
    lastBacktest: '2025-03-28', 
    pnl: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    status: 'idle',
    tScore: 0,
    cumulativePnl: 0
  }
];

function PipelineView() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [selectedNode, setSelectedNode] = useState('data');
  const [activeTab, setActiveTab] = useState('overview');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'system', message: 'Welcome! Select a pipeline node and tell me what you want to configure or analyze.' }
  ]);

  useEffect(() => {
    // In a real app, you'd fetch this from an API
    const foundProject = mockProjects.find(p => p.id.toString() === projectId);
    setProject(foundProject || null);
  }, [projectId]);

  if (!project) {
    return <div className="content-container">Project not found</div>;
  }

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    // Add a system message when node changes
    setChatMessages([
      { sender: 'system', message: `Switched to ${node}. How can I help you configure or analyze it?` }
    ]);
  };

  const handleSendMessage = (messageText) => {
    if (!messageText.trim()) return;
    
    // We already added the user message in the ChatPanel component
    // Just add the system response here
    const agentResponse = { 
      sender: 'system', 
      message: `I'll process your request about ${selectedNode}: "${messageText}".
      
Currently, I can help you with:
• Fetching and configuring data sources
• Creating and optimizing factors
• Building trading strategies
• Running backtests
• Monitoring live trading

What specific aspect of ${selectedNode} would you like to work on?` 
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
          <h3>Data Configuration & Visualization</h3>
          <div className="node-detail-stats">
            <div className="stat-item">
              <span className="stat-label">Source</span>
              <span className="stat-value">Yahoo Finance</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Symbols</span>
              <span className="stat-value">AAPL, MSFT, GOOG, AMZN, META</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Timeframe</span>
              <span className="stat-value">Daily</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Period</span>
              <span className="stat-value">Last 2 years</span>
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
                  examplePanel.value = "添加新的股票符号";
                }
              }}>
                添加新的股票符号
              </div>
              <div className="chat-prompt-example" onClick={() => {
                const examplePanel = document.querySelector('.chat-panel-input input');
                if (examplePanel) {
                  examplePanel.focus();
                  examplePanel.value = "将时间周期更改为每周";
                }
              }}>
                将时间周期更改为每周
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
            Overview
          </div>
          <div 
            className={`node-details-tab ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            Config
          </div>
          <div 
            className={`node-details-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </div>
        </div>
        
        <div className="node-details-content">
          {activeTab === 'overview' && (
            <div>
              <h4>{selectedNode.charAt(0).toUpperCase() + selectedNode.slice(1)} Overview</h4>
              
              <div className="node-detail-stats">
                {selectedNode === 'factor' && (
                  <>
                    <div className="stat-item">
                      <span className="stat-label">Active Factors</span>
                      <span className="stat-value">3</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Highest IC</span>
                      <span className="stat-value">0.42</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Last Updated</span>
                      <span className="stat-value">2025-04-15</span>
                    </div>
                  </>
                )}
                
                {selectedNode === 'strategy' && (
                  <>
                    <div className="stat-item">
                      <span className="stat-label">Strategy Type</span>
                      <span className="stat-value">Mean Reversion</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Factors Used</span>
                      <span className="stat-value">2</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Risk Limit</span>
                      <span className="stat-value">5%</span>
                    </div>
                  </>
                )}
                
                {selectedNode === 'backtest' && (
                  <>
                    <div className="stat-item">
                      <span className="stat-label">Sharpe Ratio</span>
                      <span className="stat-value">1.86</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Max Drawdown</span>
                      <span className="stat-value">-12.4%</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Win Rate</span>
                      <span className="stat-value">68%</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Test Period</span>
                      <span className="stat-value">2024 Q1</span>
                    </div>
                  </>
                )}
                
                {selectedNode === 'live' && (
                  <>
                    <div className="stat-item">
                      <span className="stat-label">Status</span>
                      <span className="stat-value">{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">P&L</span>
                      <span className="stat-value">{project.cumulativePnl}%</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Positions</span>
                      <span className="stat-value">4 Long / 2 Short</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Start Date</span>
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
              <h4>{selectedNode.charAt(0).toUpperCase() + selectedNode.slice(1)} Configuration</h4>
              {selectedNode === 'factor' && (
                <div className="config-editor">
                  <pre className="code-block">
{`# Factor Configuration
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
{`# Strategy Configuration
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
{`# Backtest Configuration
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
{`# Live Trading Configuration
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
                <h4 style={{ margin: 0 }}>Version History</h4>
                <button className="btn">Create Snapshot</button>
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
                    <div style={{ fontWeight: '500' }}>Added volume factor</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Apr 15, 2025 • 10:45 AM</div>
                  </div>
                  <button className="btn">Restore</button>
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
                    <div style={{ fontWeight: '500' }}>Optimized strategy weights</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Apr 10, 2025 • 2:30 PM</div>
                  </div>
                  <button className="btn">Restore</button>
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
                    <div style={{ fontWeight: '500' }}>Initial configuration</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Apr 1, 2025 • 9:15 AM</div>
                  </div>
                  <button className="btn">Restore</button>
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
    <div className="pipeline-view-container">
      <main className="pipeline-main-area">
        <header className="project-header">
          <div className="project-title-section">
            <h2>{project.name}</h2>
            <div className="project-actions">
              <button className="btn">
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                  <path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm80-320v-80h80v-240h80v240h80v80H360Zm320-80v-80h160v80H680Z"/>
                </svg>
                Re-Backtest
              </button>
              <button 
                className="btn" 
                style={{
                  backgroundColor: project.status === 'live' ? 'var(--warning-500)' : 'var(--success-500)',
                  color: 'white',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                  <path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
                </svg>
                {project.status === 'live' ? 'Pause Trading' : 'Go Live'}
              </button>
              <button className="btn">
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                  <path d="M220-160q-24 0-42-18t-18-42v-143h60v143h520v-143h60v143q0 24-18 42t-42 18H220Zm260-153L287-506l43-43 120 120v-371h60v371l120-120 43 43-193 193Z"/>
                </svg>
                Export
              </button>
            </div>
          </div>
          
          <div className="project-stats">
            <div className="stat-card">
              <div className="stat-card-title">Status</div>
              <div className="stat-card-value">
                <span className={`status-indicator status-${project.status}`}></span>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-card-title">Last Backtest</div>
              <div className="stat-card-value">{project.lastBacktest}</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-card-title">P&L</div>
              <div className="stat-card-value" style={{ 
                color: project.cumulativePnl >= 0 ? 'var(--success-500)' : 'var(--error-500)' 
              }}>
                {project.cumulativePnl}%
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-card-title">T-Score</div>
              <div className="stat-card-value">
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{
                      width: `${project.tScore}%`,
                      backgroundColor: project.tScore > 70 ? 'var(--success-500)' : 
                                      project.tScore > 40 ? 'var(--warning-500)' : 
                                      'var(--error-500)'
                    }}
                  ></div>
                </div>
                <div className="score-value">{project.tScore}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="breadcrumb">
          <Link to="/projects">Projects</Link> / {project.name} / Pipeline
        </div>

        <div className="pipeline-navigator">
          <div 
            className={`pipeline-node ${selectedNode === 'data' ? 'active' : ''}`}
            onClick={() => handleNodeClick('data')}
            style={{
              transform: selectedNode === 'data' ? 'translateY(-4px) scale(1.05)' : 'scale(1)',
              boxShadow: selectedNode === 'data' ? 'var(--shadow-3)' : 'var(--shadow-1)'
            }}
          >
            <div className="pipeline-node-icon">{getNodeIcon('data')}</div>
            <div className="pipeline-node-title">Data</div>
            <div className="pipeline-node-status">
              <span className="status-indicator status-live"></span>
              <span>Ready</span>
            </div>
          </div>
          
          <div className="pipeline-arrow">→</div>
          
          <div 
            className={`pipeline-node ${selectedNode === 'factor' ? 'active' : ''}`}
            onClick={() => handleNodeClick('factor')}
            style={{
              transform: selectedNode === 'factor' ? 'translateY(-4px) scale(1.05)' : 'scale(1)',
              boxShadow: selectedNode === 'factor' ? 'var(--shadow-3)' : 'var(--shadow-1)'
            }}
          >
            <div className="pipeline-node-icon">{getNodeIcon('factor')}</div>
            <div className="pipeline-node-title">Factor</div>
            <div className="pipeline-node-status">
              <span className="status-indicator status-live"></span>
              <span>3 Active</span>
            </div>
          </div>
          
          <div className="pipeline-arrow">→</div>
          
          <div 
            className={`pipeline-node ${selectedNode === 'strategy' ? 'active' : ''}`}
            onClick={() => handleNodeClick('strategy')}
            style={{
              transform: selectedNode === 'strategy' ? 'translateY(-4px) scale(1.05)' : 'scale(1)',
              boxShadow: selectedNode === 'strategy' ? 'var(--shadow-3)' : 'var(--shadow-1)'
            }}
          >
            <div className="pipeline-node-icon">{getNodeIcon('strategy')}</div>
            <div className="pipeline-node-title">Strategy</div>
            <div className="pipeline-node-status">
              <span className="status-indicator status-live"></span>
              <span>Configured</span>
            </div>
          </div>
          
          <div className="pipeline-arrow">→</div>
          
          <div 
            className={`pipeline-node ${selectedNode === 'backtest' ? 'active' : ''}`}
            onClick={() => handleNodeClick('backtest')}
            style={{
              transform: selectedNode === 'backtest' ? 'translateY(-4px) scale(1.05)' : 'scale(1)',
              boxShadow: selectedNode === 'backtest' ? 'var(--shadow-3)' : 'var(--shadow-1)'
            }}
          >
            <div className="pipeline-node-icon">{getNodeIcon('backtest')}</div>
            <div className="pipeline-node-title">Backtest</div>
            <div className="pipeline-node-status">
              <span className="status-indicator status-live"></span>
              <span>Sharpe 1.86</span>
            </div>
          </div>
          
          <div className="pipeline-arrow">→</div>
          
          <div 
            className={`pipeline-node ${selectedNode === 'live' ? 'active' : ''}`}
            onClick={() => handleNodeClick('live')}
            style={{
              transform: selectedNode === 'live' ? 'translateY(-4px) scale(1.05)' : 'scale(1)',
              boxShadow: selectedNode === 'live' ? 'var(--shadow-3)' : 'var(--shadow-1)'
            }}
          >
            <div className="pipeline-node-icon">{getNodeIcon('live')}</div>
            <div className="pipeline-node-title">Live</div>
            <div className="pipeline-node-status">
              <span className={`status-indicator status-${project.status}`}></span>
              <span>{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
            </div>
          </div>
        </div>

        <div className="pipeline-main-content">
          {renderNodeDetails()}
        </div>
      </main>

      <aside className="pipeline-chat-area">
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
