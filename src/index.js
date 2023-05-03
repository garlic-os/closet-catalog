import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './screens/Dashboard/dashboardindex.js';
// import Container from './components/container/container.js'
// import Login from './screens/Login/loginindex.js';
import "./App.css";

const App = () => (
    <div className='app'>
        <Dashboard />
    </div>
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);