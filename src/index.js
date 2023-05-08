import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './screens/Dashboard/dashboardindex.js';
import Login from './screens/Login/loginindex.js';
import eventBus from './EventBus/eventbus.js';
import "./App.css";

class App extends React.Component {
    constructor() {
        super();
        // Constructor creates the loggedin state
        this.state = { isLoggedIn: !!localStorage.getItem("token") };

        eventBus.on("logging in", () => {
            this.setState({ isLoggedIn: true });
        });

        eventBus.on("logging out", () => {
            localStorage.removeItem("token");
            this.setState({ isLoggedIn: false });
        });
    }

    render () {
        return (
            <div className='app'>
                {/* If the state is in login, display the dashboard, otherwise the login screen */}
                    {this.state.isLoggedIn ? <Dashboard /> : <Login />}
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
