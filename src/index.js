import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './screens/Dashboard/dashboardindex.js';
import Container from './components/container/container.js'
import "./App.css";

const App = () => (
    <div className='app'>
        <Dashboard />
        <Container name="my container"/>
    </div>
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);