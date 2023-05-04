import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './screens/Dashboard/dashboardindex.js';
import Login from './screens/Login/loginindex.js';
import "./App.css";

class App extends React.Component {
  constructor() {
    super()
    this.state = {isLoggedIn: true}
  }

  render () {
    return (
      <div className='app'>
          {this.state.isLoggedIn? <Dashboard />:<Login />}
      </div>
    )
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);