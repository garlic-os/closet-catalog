import React from 'react';
import ReactDOM from 'react-dom/client';
// import Dashboard from './screens/Dashboard/index.js';
// import Container from './components/container/container.js'
import Login from './screens/Login/index.js';
import "./App.css";

const App = () => (
    <div className='app'>
        <Login />
    </div>
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);