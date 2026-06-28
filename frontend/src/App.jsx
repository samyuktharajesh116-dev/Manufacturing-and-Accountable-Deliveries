import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// Placeholder views so the app compiles cleanly until your friends upload their real components
const LogisticsDashboard = () => <div style={{ padding: '20px' }}><h2>🚚 Logistics Dashboard View</h2><p>Waiting for code upload...</p></div>;
const SlotSchedulingPage = () => <div style={{ padding: '20px' }}><h2>📅 Slot Scheduling View</h2><p>Waiting for code upload...</p></div>;
const PerformanceTab = () => <div style={{ padding: '20px' }}><h2>📈 Performance Track View</h2><p>Waiting for code upload...</p></div>;

function App() {
  return (
    <Router>
      <div className="app-container" style={{ fontFamily: 'Arial, sans-serif' }}>
        
        {/* Navigation Tabs */}
        <nav className="tab-navbar" style={{
          display: 'flex', 
          gap: '20px', 
          padding: '15px', 
          backgroundColor: '#2c3e50',
          marginBottom: '20px'
        }}>
          <Link to="/logistics" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Logistics Dashboard</Link>
          <Link to="/slots" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Slot Scheduling</Link>
          <Link to="/performance" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Performance Track</Link>
        </nav>

        {/* Tab Content Display */}
        <main className="tab-content" style={{ padding: '0 20px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/logistics" replace />} />
            <Route path="/logistics" element={<LogisticsDashboard />} />
            <Route path="/slots" element={<SlotSchedulingPage />} />
            <Route path="/performance" element={<PerformanceTab />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;