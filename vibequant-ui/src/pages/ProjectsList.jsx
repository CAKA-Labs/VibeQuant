import { useState } from 'react'
import { Link } from 'react-router-dom'
import PortfolioDashboard from '../components/PortfolioDashboard'

// Mock data for demo purposes
const mockProjects = [
  { 
    id: 1, 
    name: 'Alpha 策略', 
    lastBacktest: '2025-04-15', 
    pnl: [5, 8, -2, 3, 7, 9, 3, -1, 4, 6, 2, 5, -1, 3, 6, 8, 4, 1, 5, 7, 3, 9, -2, 4, 6, 8, 5, 2, 4, 7], // 30 data points
    status: 'live',
    sharpe: 1.86,
    investmentAmount: 100000, // Initial investment in USD
    returns: 42.5, // Return percentage
    maxDrawdown: 8.2, // Maximum drawdown percentage
    volatility: 12.3, // Volatility percentage
    returnToRisk: 3.45, // Return to risk ratio
    winRate: 68, // Win rate percentage
    positions: 12, // Number of positions
    avgTradeTime: 3.2 // Average trade time in days
  },
  { 
    id: 2, 
    name: 'Beta 动量', 
    lastBacktest: '2025-04-10', 
    pnl: [2, -1, -3, 4, 5, 6, 1, 0, -2, 3, 1, 4, -1, 2, 5, 4, 2, 1, 3, 6, 0, -1, 2, 4, 3, 1, 2, 5, -1, 0], // 30 data points
    status: 'paused',
    sharpe: 0.75,
    investmentAmount: 75000, // Initial investment in USD
    returns: 15.3, // Return percentage
    maxDrawdown: 12.7, // Maximum drawdown percentage
    volatility: 18.5, // Volatility percentage
    returnToRisk: 0.83, // Return to risk ratio
    winRate: 52, // Win rate percentage
    positions: 8, // Number of positions
    avgTradeTime: 4.6 // Average trade time in days
  },
  { 
    id: 3, 
    name: 'Gamma 因子', 
    lastBacktest: '2025-03-28', 
    pnl: [0, 1, 0, -1, 1, 0, 0, 1, 0, -1, 0, 0, 1, 0, 0, 0, -1, 0, 1, 0, 0, 0, 1, 0, -1, 0, 0, 1, 0, 0], // 30 data points
    status: 'idle',
    sharpe: 0.12,
    investmentAmount: 50000, // Initial investment in USD
    returns: 0.9, // Return percentage
    maxDrawdown: 3.2, // Maximum drawdown percentage
    volatility: 7.5, // Volatility percentage
    returnToRisk: 0.12, // Return to risk ratio
    winRate: 50, // Win rate percentage
    positions: 3, // Number of positions
    avgTradeTime: 2.8 // Average trade time in days
  },
  { 
    id: 4, 
    name: 'Delta 反转', 
    lastBacktest: '2025-04-18', 
    pnl: [7, 5, 8, 9, 6, 10, 8, 7, 9, 11, 6, 8, 5, 9, 10, 12, 9, 8, 10, 11, 7, 9, 6, 10, 11, 13, 10, 8, 11, 12], // 30 data points
    status: 'live',
    sharpe: 2.51,
    investmentAmount: 250000, // Initial investment in USD
    returns: 87.2, // Return percentage
    maxDrawdown: 6.8, // Maximum drawdown percentage
    volatility: 14.8, // Volatility percentage
    returnToRisk: 5.89, // Return to risk ratio
    winRate: 78, // Win rate percentage
    positions: 15, // Number of positions
    avgTradeTime: 2.3 // Average trade time in days
  },
  { 
    id: 5, 
    name: '波动率趋势', 
    lastBacktest: '2025-04-01', 
    pnl: [-3, -1, 0, -2, 1, -1, 0, -2, -1, 0, 1, -1, -2, 0, -1, -3, 0, -1, -2, 1, -1, 0, -2, -1, 0, 1, -1, -2, 0, -1], // 30 data points
    status: 'idle',
    sharpe: -0.33,
    investmentAmount: 80000, // Initial investment in USD
    returns: -12.7, // Return percentage
    maxDrawdown: 18.3, // Maximum drawdown percentage
    volatility: 22.1, // Volatility percentage
    returnToRisk: -0.57, // Return to risk ratio
    winRate: 32, // Win rate percentage
    positions: 6, // Number of positions
    avgTradeTime: 5.1 // Average trade time in days
  }
];

// Simple sparkline component (more robust)
const Sparkline = ({ data, height = 30, width = 100 }) => {
  if (!data || data.length === 0) return <div className="sparkline" style={{ height: `${height}px`, width: `${width}px`, border: '1px dashed #eee' }}></div>;

  const maxVal = Math.max(...data, 0);
  const minVal = Math.min(...data, 0);
  const range = maxVal - minVal || 1; // Avoid division by zero

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - minVal) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');
  
  const zeroLineY = height - ((0 - minVal) / range) * height;
  const lineColor = data[data.length - 1] >= data[0] ? 'var(--success-color)' : 'var(--error-color)';

  return (
    <svg className="sparkline" width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {/* Zero line */}
      <line x1="0" y1={zeroLineY} x2={width} y2={zeroLineY} stroke="#eee" strokeWidth="1" />
      {/* P&L line */}
      <polyline
        fill="none"
        stroke={lineColor}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
};

function ProjectsList() {
  const [projects, setProjects] = useState(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects based on search query
  const filteredProjects = searchQuery 
    ? projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : projects;

  return (
    <div>
      <header className="app-header">
        <div className="app-logo">
          <span className="brand-name">VibeQuant</span>
        </div>
        <Link to="/project/new" className="btn btn-primary">
          <span className="icon">+</span> 新建策略
        </Link>
      </header>

      <main className="content-container">
        {/* Portfolio Dashboard integration */}
        <PortfolioDashboard />
        
        <div className="project-grid">
          {filteredProjects.map(project => (
            <Link to={`/project/${project.id}`} key={project.id} className="project-card">
              <div className="project-card-header">
                <span className="project-card-title">{project.name}</span>
                <span className={`project-card-status ${project.status}`}>
                  <span className="status-indicator"></span>
                  {project.status === 'live' ? '运行中' : project.status === 'paused' ? '暂停' : '空闲'}
                </span>
              </div>
              <div className="project-card-body">
                <div className="project-metrics-grid">
                  <div className="project-card-metric">
                    <span className="metric-label">投资额</span>
                    <span className="metric-value">${project.investmentAmount.toLocaleString()}</span>
                  </div>
                  <div className="project-card-metric">
                    <span className="metric-label">收益率</span>
                    <span className={`metric-value ${project.returns >= 0 ? 'positive' : 'negative'}`}>
                      {project.returns >= 0 ? '+' : ''}{project.returns.toFixed(2)}%
                    </span>
                  </div>
                  <div className="project-card-metric">
                    <span className="metric-label">夏普比率</span>
                    <span className="metric-value">{project.sharpe.toFixed(2)}</span>
                  </div>
                  <div className="project-card-metric">
                    <span className="metric-label">最大回撤</span>
                    <span className="metric-value">-{project.maxDrawdown.toFixed(1)}%</span>
                  </div>
                  <div className="project-card-metric">
                    <span className="metric-label">波动率</span>
                    <span className="metric-value">{project.volatility.toFixed(1)}%</span>
                  </div>
                  <div className="project-card-metric">
                    <span className="metric-label">胜率</span>
                    <span className="metric-value">{project.winRate}%</span>
                  </div>
                </div>
                <div className="project-card-sparkline">
                  <Sparkline data={project.pnl} width={240} height={30}/>
                </div>
                <div className="project-card-subtitle">
                  最近回测: <strong>{project.lastBacktest}</strong> • 持仓数: <strong>{project.positions}</strong>
                </div>
              </div>
              <div className="project-card-actions">
                 <button className="btn">⋯</button> {/* More actions placeholder */}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ProjectsList;
