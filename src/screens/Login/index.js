import React from 'react';
import "./login.css";


class  Login extends React.Component {
    // Used when creating the login screen
    constructor(props) {
        super(props);
        
        // login is the first card you see when you visit the website
        this.state = {isLogin: true};

        // Necessary to make 'this' work in the callback
        // this.handleButtons = this.handleButtons.bind(this);
    }

    handleButtons() {
        console.log("Hello World");
        this.setState(prevState => ({isLogin:!prevState.isLogin}));
    }

    render() {
        return (
            <div id="login">
                <h1>Closet Catalog</h1>
                <p>Welcome to the ClosetCatalog! This is a database that you can access anywhere on the internet.</p>
                
                {(this.state.isLogin) ? 
                (<div id="card" class="center">
                    <h2>Login</h2>
                    <p>Please login or create an account.</p>
                    <form>
                        <label for="uname"><b>Username: </b></label>
                        <input type="text" placeholder="Enter Username" name="uname" required></input>
                        <br></br><br></br>
                        <label for="psw"><b>Password: </b></label>
                        <input type="password" placeholder="Enter Password" name="psw" required></input>
                        <br></br><br></br>
                        <button type="submit" class="grayedout">Login</button>
                        <button type="button">Create Account</button>
                    </form>
                </div>)
            :
            (<div id="card" class="center">
                <h2>Create an Account</h2>
                <p>Create an account with Closet Catalog</p>
                <form>
                    <label for="uname"><b>Username: </b></label>
                    <input type="text" placeholder="Enter Username" name="uname" required></input>
                    <br></br><br></br>
                    <label for="psw"><b>Password: </b></label>
                    <input type="password" placeholder="Enter Password" name="psw" required></input>
                    <br></br><br></br>
                    <button type="submit">Login</button>
                    <button type="button" class="grayedout">Create Account</button>
                </form>
            </div>)}
            </div>
        )
    }

}

export default Login;