import React from 'react';
import "./index.css";
import eventBus from '../../EventBus/eventbus.js'

class ToggleBar extends React.Component {

    constructor() {
        let items = false;
        let containers = false;
        let shelves = false;
        super()
        this.state = {isInDashboard: true}
        this.toggleBarCommandsDidMount()
        this.handleBackButton()
        this.showingContainer()
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
                            <input type="checkbox" id="showitems" onChange={() => this.handleToggle("item")}></input><b> Show Items</b>
                        </div>
                        <div>
                            <input type="checkbox" id="showcontainers" onChange={() => this.handleToggle("container")}></input><b> Show Containers</b>
                        </div>
                        <div>
                            <input type="checkbox" id="showshelves" onChange={() => this.handleToggle("shelf")}></input><b> Show Shelves</b>
                        </div>
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
        this.state = {isInDashboard: true};
    }

    

    render() {
        return (
            <div id="header">
                <table>
                    <tbody>
                        <tr>
                            <td id="left"><button type="button">Sign Out</button></td>
                            <td id="middle"><h1>Joe's Closet</h1></td>
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