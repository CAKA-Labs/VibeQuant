import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import FinancialChart from '../components/FinancialChart'; // Import the new chart component
import ChatPanel from '../components/ChatPanel'; // Import the new ChatPanel

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
    // Optionally reset chat or add a system message when node changes
    setChatMessages([
      { sender: 'system', message: `Switched to ${node}. How can I help you configure or analyze it?` }
    ]);
  };

  const handleSendMessage = (messageText) => {
    if (!messageText.trim()) return;
    
    const newUserMessage = { sender: 'user', message: messageText };
    // Simulate agent response (replace with actual agent logic)
    const agentResponse = { sender: 'system', message: `Received: "${messageText}". Processing for ${selectedNode}...` };

    setChatMessages([...chatMessages, newUserMessage, agentResponse]);
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

  return (
    <div className="pipeline-view-container">
      <main className="pipeline-main-area">
        <header style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '500' }}>{project.name}</h2>
            <div style={{display: 'flex', gap: '12px'}}>
              <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                  <path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm80-320v-80h80v-240h80v240h80v80H360Zm320-80v-80h160v80H680Z"/>
                </svg>
                Re-Backtest
              </button>
              <button 
                className="btn" 
                style={{
                  backgroundColor: project.status === 'live' ? 'var(--warning-color)' : 'var(--success-color)',
                  color: 'white',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                  <path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
                </svg>
                {project.status === 'live' ? 'Pause' : 'Go Live'}
              </button>
              <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                  <path d="M240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
                </svg>
                Export
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            backgroundColor: 'transparent',
            marginBottom: '24px'
          }}>
            <div style={{
              backgroundColor: 'var(--surface-color)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '16px',
              boxShadow: 'var(--box-shadow)',
              transition: 'all var(--transition-normal)'
            }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Status</div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                fontSize: '1.2rem', 
                fontWeight: '500',
                color: project.status === 'live' ? 'var(--success-color)' : 'var(--warning-color)'
              }}>
                <span className={`status-indicator status-${project.status}`} style={{ width: '10px', height: '10px' }}></span>
                <span style={{ marginLeft: '8px' }}>{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'var(--surface-color)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '16px',
              boxShadow: 'var(--box-shadow)',
              transition: 'all var(--transition-normal)'
            }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Last Backtest</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>{project.lastBacktest}</div>
            </div>
            
            <div style={{
              backgroundColor: 'var(--surface-color)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '16px',
              boxShadow: 'var(--box-shadow)',
              transition: 'all var(--transition-normal)'
            }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Cumulative PnL</div>
              <div style={{ 
                fontSize: '1.2rem', 
                fontWeight: '500',
                color: project.cumulativePnl >= 0 ? 'var(--success-color)' : 'var(--error-color)'
              }}>{project.cumulativePnl}%</div>
            </div>
            
            <div style={{
              backgroundColor: 'var(--surface-color)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '16px',
              boxShadow: 'var(--box-shadow)',
              transition: 'all var(--transition-normal)'
            }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>T-Score</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  height: '8px',
                  flex: '1',
                  backgroundColor: '#eee',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${project.tScore}%`,
                    backgroundColor: project.tScore > 70 ? 'var(--success-color)' : 
                                    project.tScore > 40 ? 'var(--warning-color)' : 
                                    'var(--error-color)',
                    borderRadius: '4px',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>{project.tScore}</div>
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
              boxShadow: selectedNode === 'data' ? 'var(--box-shadow-elevated)' : 'var(--box-shadow)'
            }}
          >
            <div className="pipeline-node-icon">📊</div>
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
              boxShadow: selectedNode === 'factor' ? 'var(--box-shadow-elevated)' : 'var(--box-shadow)'
            }}
          >
            <div className="pipeline-node-icon">🧩</div>
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
              boxShadow: selectedNode === 'strategy' ? 'var(--box-shadow-elevated)' : 'var(--box-shadow)'
            }}
          >
            <div className="pipeline-node-icon">🎯</div>
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
              boxShadow: selectedNode === 'backtest' ? 'var(--box-shadow-elevated)' : 'var(--box-shadow)'
            }}
          >
            <div className="pipeline-node-icon">🔍</div>
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
              boxShadow: selectedNode === 'live' ? 'var(--box-shadow-elevated)' : 'var(--box-shadow)'
            }}
          >
            <div className="pipeline-node-icon">🚀</div>
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
