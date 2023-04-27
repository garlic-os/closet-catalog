import React from 'react';
import "./index.css";

const ToggleBar = () => (
    <div id="togglebar">
        <div>
            <input type="checkbox" id="showcontainers"></input><label for="showcontainers"> Show Containers</label>
        </div>
        <div>
            <input type="checkbox" id="showshelves"></input><label for="showshelvess"> Show Shelves</label>
        </div>
        <div>
            <input type="checkbox" id="showitems"></input><label for="showitems"> Show Items</label>
        </div>
    </div>
)

const Header = () => (
    <div id="header">
        <table>
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
        </table>
        


        <ToggleBar />
    </div>
)

export default Header;