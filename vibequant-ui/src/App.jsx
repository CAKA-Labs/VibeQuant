import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Pages
import ProjectsList from './pages/ProjectsList'
import PipelineView from './pages/PipelineView'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<ProjectsList />} />
          <Route path="/project/:projectId" element={<PipelineView />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
