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
          {/* Placeholder for K-line charts, news feed, volume etc. */}
          <p><strong>Data Source:</strong> Yahoo Finance</p>
          <p><strong>Symbols:</strong> AAPL, MSFT, GOOG, AMZN, META</p>
          <p><strong>Timeframe:</strong> Daily</p>
          <p><strong>Period:</strong> Last 2 years</p>
          {/* Replace placeholder div with the FinancialChart component */}
          {/* The chart will now take up the space styled by data-node-content-area */}
          <div style={{ flexGrow: 1, marginTop: '16px', border: '1px solid #eee' }}> 
            {/* Container div ensures chart has a parent to resize against */}
            <FinancialChart />
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
              <p>This section provides a summary of the <strong>{selectedNode}</strong> configuration and status.</p>
              <p>Current Status: [Mock Status]</p>
              <p>Last Updated: [Mock Date]</p>
              {/* Add more relevant overview details per node */} 
              <hr />
              <p>Use the <strong>Agent Chat</strong> panel on the right to view detailed configurations, make changes, or run analyses for the <strong>{selectedNode}</strong> node.</p>
            </div>
          )}
          {activeTab === 'config' && (
            <div>
              <h4>{selectedNode.charAt(0).toUpperCase() + selectedNode.slice(1)} Configuration</h4>
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
      <main className="pipeline-main-area">
        <header style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0 }}>{project.name} - Pipeline</h2>
            <div style={{display: 'flex', gap: '12px'}}>
              <button className="btn">
                Re-Backtest
              </button>
              <button className="btn" style={{
                backgroundColor: project.status === 'live' ? 'var(--warning-color)' : 'var(--success-color)',
                color: 'white',
              }}>
                {project.status === 'live' ? 'Pause' : 'Go Live'}
              </button>
              <button className="btn">
                Download Report
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex', 
            gap: '24px', 
            padding: '16px',
            backgroundColor: 'var(--background-alt)',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <div><strong>Status:</strong> <span style={{ color: project.status === 'live' ? 'var(--success-color)' : 'var(--warning-color)' }}>{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span></div>
            <div><strong>Last Backtest:</strong> {project.lastBacktest}</div>
            <div><strong>Cumulative PnL:</strong> {project.cumulativePnl}%</div>
            <div><strong>T-Score:</strong> {project.tScore}</div>
            <div style={{ width: '150px', height: '30px', backgroundColor: '#eee', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8em', color: '#666' }}>30d PnL Chart</div>
          </div>
        </header>

        <div className="breadcrumb">
          <Link to="/projects">Projects</Link> / {project.name} / Pipeline
        </div>

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
