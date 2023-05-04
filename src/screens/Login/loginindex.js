import React from 'react';
import "./login.css";
import eventBus from '../../EventBus/eventbus';


class  Login extends React.Component {
    // Used when creating the login screen
    constructor(props) {
        super(props);
        
        // login is the first card you see when you visit the website
        this.state = {isLogin: true};

        // Necessary to make 'this' work in the callback
        this.handleButtons = this.handleButtons.bind(this);
    }

    handleButtons() {
        this.setState(prevState => ({isLogin:!prevState.isLogin}));
    }

    // John: The functionality of this component will have to altered a bit.
    // This creates an event and a message is sent out that says "logging in"
    // An event listener will listen for this specific message in the index.js
    // Here's the functionality that needs to be added:
    // Once the button is clicked(already have this) AND the user inputed the correct credentials
    // we can dispatch the event to the document. Let me know when you get this done
    dispatchLoginEvent() {
        eventBus.dispatch("logging in", { message: "logging in"});
    }

    render() {
        return (
            <div id="login">
                <h1>Closet Catalog</h1>
                <p>Welcome to the ClosetCatalog! This is a database that you can access anywhere on the internet.</p>
                
                {(this.state.isLogin) ?
                (<div id="card" className="center">
                    <h2>Login</h2>
                    <p>Please login or create an account.</p>
                    <form action="/login" method="POST">
                        <b>Username: </b>
                        <input type="text" placeholder="Enter Username" id="uname" name="username" required></input>
                        <br></br><br></br>
                        <b>Password: </b>
                        <input type="password" placeholder="Enter Password" id="psw" name="password" required></input>
                        <br></br><br></br>
                        <input type="submit" value="Log in" />
                        <br></br><br></br>
                        <b>Don't have an Account? </b>
                        <button type="button" onClick={() => this.handleButtons()}>Create</button>
                    </form>
                </div>)
                :
                (<div id="card" className="center">
                    <h2>Create an Account</h2>
                    <p>Create an account with Closet Catalog</p>
                    <form action="/register" method="POST">
                        <b>Username: </b>
                        <input type="text" placeholder="Enter Username" name="username" required></input>
                        <br></br><br></br>
                        <b>Password: </b>
                        <input type="password" placeholder="Enter Password" name="password" required></input>
                        <br></br><br></br>
                        <input type="submit" value="Create Account" />
                        <br></br><br></br>
                        <b>Already have an Account? </b>
                        <button type="button" onClick={() => this.handleButtons()}>Login</button>
                    </form>
                </div>
                )}
            </div>
        )
    }
}

export default Login;