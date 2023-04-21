import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './screens/Home/homeindex.js';
import "./App.css";


const App = () => (
    <div className='app'>
        <Home />
    </div>
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);