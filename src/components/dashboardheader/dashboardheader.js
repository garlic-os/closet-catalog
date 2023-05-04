import React from 'react';
import "./index.css";
import eventBus from '../../EventBus/eventbus.js'

class ToggleBar extends React.Component {

    handleButton = (type) => {
        if (type === "item") {
            eventBus.dispatch("adding item", {message: "adding item"});
        } else if (type === "container") {
            eventBus.dispatch("adding container", {message: "adding container"});
        } else if (type === "shelf") {
            eventBus.dispatch("adding shelf", {message: "adding shelf"});
        }
    }

    render() {
        return (
            <div id="togglebar">
                <div>
                    <input type="checkbox" id="showcontainers"></input><b> Show Containers</b>
                </div>
                <div>
                    <input type="checkbox" id="showshelves"></input><b> Show Shelves</b>
                </div>
                <div>
                    <input type="checkbox" id="showitems"></input><b> Show Items</b>
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
        )
    }
}

const DashboardHeader = () => (
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

export default DashboardHeader;