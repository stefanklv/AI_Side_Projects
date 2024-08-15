import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProposalForm from './components/ProposalForm';
import Settings from './components/Settings';
import TemplateSelection from './components/TemplateSelection';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={`${process.env.PUBLIC_URL}/Logo2_bg.png`} className="App-logo" alt="logo" />
          <nav>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/proposal">Create Proposal</Link></li>
              <li><Link to="/settings">Settings</Link></li>
              <li><Link to="/templates">Templates</Link></li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<h2>Welcome to AI Automated Proposals</h2>} />
          <Route path="/proposal" element={<ProposalForm />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/templates" element={<TemplateSelection />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
