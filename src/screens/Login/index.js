import React from 'react';
import "./login.css";


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

    render() {
        return (
            <div id="login">
                <h1>Closet Catalog</h1>
                <p>Welcome to the ClosetCatalog! This is a database that you can access anywhere on the internet.</p>
                
                {(this.state.isLogin) ?
                (<div id="card" className="center">
                    <h2>Login</h2>
                    <p>Please login or create an account.</p>
                    <form>
                        <b>Username: </b>
                        <input type="text" placeholder="Enter Username" id="uname" name="uname" required></input>
                        <br></br><br></br>
                        <b>Password: </b>
                        <input type="password" placeholder="Enter Password" id="psw" name="psw" required></input>
                        <br></br><br></br>
                        <button type="submit">Login</button>
                        <br></br><br></br>
                        <b>Don't have an Account? </b>
                        <button type="button" onClick={() => this.handleButtons()}>Create</button>
                    </form>
                </div>)
                :
                (<div id="card" className="center">
                    <h2>Create an Account</h2>
                    <p>Create an account with Closet Catalog</p>
                    <form>
                        <b>Username: </b>
                        <input type="text" placeholder="Enter Username" name="uname" required></input>
                        <br></br><br></br>
                        <b>Password: </b>
                        <input type="password" placeholder="Enter Password" name="psw" required></input>
                        <br></br><br></br>
                        <button type="submit">Create Account</button>
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