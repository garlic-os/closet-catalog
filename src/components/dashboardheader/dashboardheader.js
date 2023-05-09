import React from 'react';
import "./index.css";
import eventBus from '../../EventBus/eventbus.js'

class ToggleBar extends React.Component {
    constructor() {
        super();
        this.state = {isInDashboard: true};
        this.toggleBarCommandsDidMount();
        this.handleBackButton();
        this.showingContainer();
    }

    handleButton = (type) => {
        if (type === "item") {
            eventBus.dispatch("adding item", {message: "adding item"});
        } else if (type === "container") {
            eventBus.dispatch("adding container", {message: "adding container"});
        } else if (type === "shelf") {
            eventBus.dispatch("adding shelf", {message: "adding shelf"});
        }
    }

    handleToggle = (type) => {
        if (type === "item") {
            this.items=!this.items;
            eventBus.dispatch("showing items", {message: "showing items"});
            document.getElementById("showitems").checked = this.items;
        } else if (type === "container") {
            this.containers=!this.containers;
            eventBus.dispatch("showing containers", {message: "showing containers"});
        } else if (type === "shelf") {
            this.shelves=!this.shelves;
            eventBus.dispatch("showing shelves", {message: "showing shelves"});
        }
    }

    toggleBarCommandsDidMount() {
        eventBus.on("is in dashboard", (data) => {
            this.setState(prevState => ({isInDashboard:true}));
        }
        );
    }

    handleBackButton() {
        eventBus.dispatch("is in dashboard", {message: "is in dashboard"});
    }

    showingContainer() {
        eventBus.on("is in container", (data) => {
            this.setState(prevState => ({isInDashboard:false}));
        }
        );
    }

    render() {
        return (
            <div id="togglebar">
                {this.state.isInDashboard===true?
                    <div> 
                        <div>
                            <button type="button" onClick={() => this.handleButton("item")}>Insert Item</button>
                        </div>
                        <div>
                            <button type="button" onClick={() => this.handleButton("container")}>Insert Containers</button>
                        </div>
                        <div>
                            <button type="button" onClick={() => this.handleButton("shelf")}>Insert Shelf</button>
                        </div>
                    </div>
                    :
                    <button type="button" onClick={() => this.handleBackButton()}> {"<"} Back</button>
                }
            </div>
        )
    }
}

class DashboardHeader extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {isInDashboard: true, username: ""};
    }

    componentDidMount() {
        this.getUsername();
    }
    
    
    async getUsername() {
        // Sending a get request to the api/username endpoint and passing in session token
        // so that the server knows who it's talking to, and the server will give back the user
        const response = await fetch('http://localhost:3001/api/username', {
            headers:{'authorization': localStorage.getItem('token')}
        });
        if (response.ok) {
            const username = await response.text();
            this.setState({ username });
            // this.state.username = await response.text();
        } else {
            const data = await response.json();
            alert(data.error);
        }
    }

    render() {
        return (
            <div id="header">
                <table>
                    <tbody>
                        <tr>
                            <td id="left">
                                <button type="button"
                                        onClick={() => eventBus.dispatch("logging out")}
                                >Sign Out</button>
                            </td>
                            <td id="middle"><h1>{this.state.username}'s Closet</h1></td>
                            <td id="right">
                                <div>
                                    <input type="text"></input>
                                    <button type="submit">Search</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <ToggleBar />
            </div>
        )
    }

}

export default DashboardHeader;