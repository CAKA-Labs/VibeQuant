import { useState } from 'react'
import { Link } from 'react-router-dom'

// Mock data for demo purposes
const mockProjects = [
  { 
    id: 1, 
    name: 'Alpha Strategy', 
    lastBacktest: '2025-04-15', 
    pnl: [5, 8, -2, 3, 7, 9, 3, -1, 4, 6, 2, 5, -1, 3, 6, 8, 4, 1, 5, 7, 3, 9, -2, 4, 6, 8, 5, 2, 4, 7], // 30 data points
    status: 'live',
    sharpe: 1.86
  },
  { 
    id: 2, 
    name: 'Beta Momentum', 
    lastBacktest: '2025-04-10', 
    pnl: [2, -1, -3, 4, 5, 6, 1, 0, -2, 3, 1, 4, -1, 2, 5, 4, 2, 1, 3, 6, 0, -1, 2, 4, 3, 1, 2, 5, -1, 0], // 30 data points
    status: 'paused',
    sharpe: 0.75
  },
  { 
    id: 3, 
    name: 'Gamma Factor', 
    lastBacktest: '2025-03-28', 
    pnl: [0, 1, 0, -1, 1, 0, 0, 1, 0, -1, 0, 0, 1, 0, 0, 0, -1, 0, 1, 0, 0, 0, 1, 0, -1, 0, 0, 1, 0, 0], // 30 data points
    status: 'idle',
    sharpe: 0.12
  },
  { 
    id: 4, 
    name: 'Delta Reversal', 
    lastBacktest: '2025-04-18', 
    pnl: [7, 5, 8, 9, 6, 10, 8, 7, 9, 11, 6, 8, 5, 9, 10, 12, 9, 8, 10, 11, 7, 9, 6, 10, 11, 13, 10, 8, 11, 12], // 30 data points
    status: 'live',
    sharpe: 2.51
  },
  { 
    id: 5, 
    name: 'Volatility Trend', 
    lastBacktest: '2025-04-01', 
    pnl: [-3, -1, 0, -2, 1, -1, 0, -2, -1, 0, 1, -1, -2, 0, -1, -3, 0, -1, -2, 1, -1, 0, -2, -1, 0, 1, -1, -2, 0, -1], // 30 data points
    status: 'idle',
    sharpe: -0.33
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
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects based on search query
  const filteredProjects = searchQuery 
    ? projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : projects;

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    const newProject = {
      id: projects.length + 1,
      name: newProjectName,
      lastBacktest: '-',
      pnl: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      status: 'idle',
      sharpe: 0
    };
    
    setProjects([...projects, newProject]);
    setNewProjectName('');
    setShowNewProjectModal(false);
  };

  return (
    <div>
      <header className="app-header">
        <div className="app-logo">
          <span>VibeQuant</span>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowNewProjectModal(true)}
        >
          <span className="btn-icon">+</span> New Project
        </button>
      </header>

      <main className="content-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0 }}>Projects</h2>
          <input
            type="search"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--medium-border-radius)', // Use variable
              width: '280px' // Slightly wider search
            }}
          />
        </div>

        {filteredProjects.length > 0 ? (
          <div className="project-grid">
            {filteredProjects.map(project => (
              <Link to={`/project/${project.id}`} key={project.id} className="project-card">
                <div className="project-card-header">
                  <span className="project-card-title">{project.name}</span>
                  <span className={`project-card-status ${project.status}`}>
                    <span className="status-indicator"></span>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                <div className="project-card-body">
                  <div className="project-card-metric">
                    Last Backtest: <strong>{project.lastBacktest}</strong>
                  </div>
                  <div className="project-card-metric">
                    Sharpe Ratio: <strong>{project.sharpe?.toFixed(2) ?? 'N/A'}</strong>
                  </div>
                  <div className="project-card-sparkline">
                    <Sparkline data={project.pnl} width={240} height={30}/>
                  </div>
                </div>
                <div className="project-card-actions">
                   <button className="btn">⋯</button> {/* More actions placeholder */}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <h3 className="empty-state-title">No projects found</h3>
            <p className="empty-state-desc">Create your first project to get started</p>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowNewProjectModal(true)}
            >
              <span className="btn-icon">+</span> New Project
            </button>
          </div>
        )}
      </main>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Project</h3>
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowNewProjectModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleCreateProject}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsList;
