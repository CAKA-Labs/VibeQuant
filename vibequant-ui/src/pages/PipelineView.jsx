import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

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
  const [prompt, setPrompt] = useState('');
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'system', message: 'How can I help you with this project?' }
  ]);
  const [chatInput, setChatInput] = useState('');

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
  };

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    // In a real app, you'd send this prompt to the LLM-Dev Agent
    console.log(`Submitting prompt for ${selectedNode}: ${prompt}`);
    
    // Add to chat history
    setChatMessages([...chatMessages, 
      { sender: 'user', message: prompt },
      { sender: 'system', message: `Processing your request for ${selectedNode}...` }
    ]);
    
    setPrompt('');
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setChatMessages([...chatMessages, 
      { sender: 'user', message: chatInput },
      { sender: 'system', message: 'I understand your question. Let me analyze the current configuration...' }
    ]);
    
    setChatInput('');
  };

  const renderNodeDetails = () => {
    // Special handling for Data node to potentially use more space
    if (selectedNode === 'data') {
      return (
        <div className="node-details data-node-content-area">
          <h3>Data Configuration & Visualization</h3>
          {/* Placeholder for K-line charts, news feed, volume etc. */}
          <p><strong>Data Source:</strong> Yahoo Finance</p>
          <p><strong>Symbols:</strong> AAPL, MSFT, GOOG, AMZN, META</p>
          <p><strong>Timeframe:</strong> Daily</p>
          <p><strong>Period:</strong> Last 2 years</p>
          <div style={{marginTop: '20px', border: '1px dashed #ccc', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999'}}>
            (Data Visualization Area - K-Line Chart, etc.)
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
            className={`node-details-tab ${activeTab === 'prompt' ? 'active' : ''}`}
            onClick={() => setActiveTab('prompt')}
          >
            Prompt Edit
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
              <h3>{selectedNode.charAt(0).toUpperCase() + selectedNode.slice(1)} Configuration</h3>
              {selectedNode === 'factor' && (
                <div>
                  <p><strong>Active Factors:</strong> 3</p>
                  <p><strong>Signal Strength:</strong> Medium</p>
                  <p><strong>Feature Importance:</strong></p>
                  <ul style={{marginLeft: '24px', marginTop: '8px'}}>
                    <li>RSI (45%)</li>
                    <li>MACD (32%)</li>
                    <li>Volume (23%)</li>
                  </ul>
                </div>
              )}
              {selectedNode === 'strategy' && (
                <div>
                  <p><strong>Strategy Type:</strong> Mean Reversion</p>
                  <p><strong>Risk Management:</strong> Dynamic Stop Loss</p>
                  <p><strong>Position Sizing:</strong> Kelly Criterion</p>
                  <p><strong>Max Allocation:</strong> 20% per position</p>
                </div>
              )}
              {selectedNode === 'backtest' && (
                <div>
                  <p><strong>Last Run:</strong> {project.lastBacktest}</p>
                  <p><strong>Sharpe Ratio:</strong> 1.86</p>
                  <p><strong>Max Drawdown:</strong> 8.4%</p>
                  <p><strong>Win Rate:</strong> 62%</p>
                </div>
              )}
              {selectedNode === 'live' && (
                <div>
                  <p><strong>Status:</strong> {project.status.charAt(0).toUpperCase() + project.status.slice(1)}</p>
                  <p><strong>Running Since:</strong> 2025-04-01</p>
                  <p><strong>Current Positions:</strong> 3 active</p>
                  <p><strong>Cumulative P&L:</strong> {project.cumulativePnl}%</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'prompt' && (
            <form onSubmit={handlePromptSubmit}>
              <p>Use natural language to describe changes to the {selectedNode} configuration:</p>
              <textarea 
                className="prompt-editor"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`e.g., "${
                  selectedNode === 'factor' ? 'Create a momentum factor based on 20-day price change and volume'
                  : selectedNode === 'strategy' ? 'Implement a trend-following strategy with 2% stop loss'
                  : selectedNode === 'backtest' ? 'Run a backtest with 0.1% slippage and transaction costs'
                  : 'Deploy with maximum position size of $10,000 and notify on trades'
                }"`}
              />
              <button type="submit" className="btn btn-primary">Apply Changes</button>
            </form>
          )}
          
          {activeTab === 'history' && (
            <div>
              <div style={{marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3>Version History</h3>
                <select style={{padding: '4px 8px'}}>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>All time</option>
                </select>
              </div>
              <div>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px'}}>
                  <span style={{flexShrink: 0, marginRight: '12px', fontSize: '12px', color: '#666'}}>Apr 19, 11:30</span>
                  <span>Added MACD factor with 12,26,9 parameters</span>
                  <button className="btn" style={{marginLeft: 'auto', fontSize: '12px'}}>Restore</button>
                </div>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px', padding: '8px'}}>
                  <span style={{flexShrink: 0, marginRight: '12px', fontSize: '12px', color: '#666'}}>Apr 18, 15:45</span>
                  <span>Changed position sizing to Kelly Criterion</span>
                  <button className="btn" style={{marginLeft: 'auto', fontSize: '12px'}}>Restore</button>
                </div>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px', padding: '8px'}}>
                  <span style={{flexShrink: 0, marginRight: '12px', fontSize: '12px', color: '#666'}}>Apr 15, 09:22</span>
                  <span>Initial backtest run</span>
                  <button className="btn" style={{marginLeft: 'auto', fontSize: '12px'}}>Restore</button>
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
      <header className="app-header">
        <div className="app-logo">
          <span>VibeQuant</span>
        </div>
        <div style={{display: 'flex', gap: '12px'}}>
          <button className="btn">
            🔄 Re-Backtest
          </button>
          <button className="btn" style={{
            backgroundColor: project.status === 'live' ? 'var(--warning-color)' : 'var(--success-color)',
            color: 'white'
          }}>
            {project.status === 'live' ? '⏸ Pause' : '▶︎ Go Live'}
          </button>
          <button className="btn">
            📥 Download Report
          </button>
        </div>
      </header>

      <main className="content-container">
        <div className="breadcrumb">
          <Link to="/">Projects</Link>
          <span>/</span>
          <span>{project.name}</span>
        </div>

        {/* Gauge indicators */}
        <div style={{
          display: 'flex', 
          gap: '24px', 
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '4px',
            boxShadow: 'var(--box-shadow)',
            flex: 1
          }}>
            <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>T-Score</div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#eee',
                borderRadius: '4px',
                marginRight: '12px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${project.tScore}%`,
                  backgroundColor: project.tScore > 70 ? 'var(--success-color)' : 
                                  project.tScore > 40 ? 'var(--warning-color)' : 
                                  'var(--error-color)',
                  borderRadius: '4px'
                }}></div>
              </div>
              <span style={{fontWeight: 'bold'}}>{project.tScore}</span>
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '4px',
            boxShadow: 'var(--box-shadow)',
            flex: 1
          }}>
            <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Cumulative P&L</div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#eee',
                borderRadius: '4px',
                marginRight: '12px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${Math.min(Math.max(project.cumulativePnl, 0) / 100 * 100, 100)}%`,
                  backgroundColor: project.cumulativePnl > 0 ? 'var(--success-color)' : 'var(--error-color)',
                  borderRadius: '4px'
                }}></div>
              </div>
              <span style={{fontWeight: 'bold'}}>{project.cumulativePnl}%</span>
            </div>
          </div>
        </div>

        <main>
          {/* Pipeline Navigator - Keep this at the top of main */}
          <div className="pipeline-navigator">
            <div 
              className={`pipeline-node ${selectedNode === 'data' ? 'active' : ''}`}
              onClick={() => handleNodeClick('data')}
              style={{borderColor: selectedNode === 'data' ? 'var(--primary-color)' : 'transparent', borderWidth: '2px', borderStyle: 'solid'}}
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
              style={{borderColor: selectedNode === 'factor' ? 'var(--primary-color)' : 'transparent', borderWidth: '2px', borderStyle: 'solid'}}
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
              style={{borderColor: selectedNode === 'strategy' ? 'var(--primary-color)' : 'transparent', borderWidth: '2px', borderStyle: 'solid'}}
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
              style={{borderColor: selectedNode === 'backtest' ? 'var(--primary-color)' : 'transparent', borderWidth: '2px', borderStyle: 'solid'}}
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
              style={{borderColor: selectedNode === 'live' ? 'var(--primary-color)' : 'transparent', borderWidth: '2px', borderStyle: 'solid'}}
            >
              <div className="pipeline-node-icon">🚀</div>
              <div className="pipeline-node-title">Live</div>
              <div className="pipeline-node-status">
                <span className={`status-indicator status-${project.status}`}></span>
                <span>{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
              </div>
            </div>
          </div>

          {/* Main Content Area - Wraps node details */}
          <div className="pipeline-main-content">
            {/* Node details will render here */}
            {renderNodeDetails()}
          </div>
        </main>

        {/* Chat Dock */}
        <div className="chat-dock" style={{ height: chatExpanded ? '400px' : '48px' }}>
          <div className="chat-dock-header" onClick={() => setChatExpanded(!chatExpanded)}>
            <div className="chat-dock-title">
              Agent Chat {chatExpanded ? '▼' : '▲'}
            </div>
          </div>
          
          {chatExpanded && (
            <>
              <div className="chat-dock-content">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      marginBottom: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      backgroundColor: msg.sender === 'user' ? 'var(--primary-color)' : '#f0f0f0',
                      color: msg.sender === 'user' ? 'white' : 'var(--text-color)',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      maxWidth: '85%'
                    }}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="chat-input">
                <form onSubmit={handleChatSubmit} style={{ display: 'flex', width: '100%' }}>
                  <input
                    type="text"
                    placeholder="Ask a question or type /help..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn btn-primary">Send</button>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default PipelineView;
