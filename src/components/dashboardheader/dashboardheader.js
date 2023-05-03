import React from 'react';
import "./index.css";


/**
 * Create an item and add it to a shelf or container.
 * Update the interface to display the new item’s information and picture.
 * @param {string} shelfOrContainerID
 * @param {string} itemTypeName - name of the item type
 * @param {number} initialCount (default: 1)
 * @param {string} description (default: NULL)
 * @param {string} photoURL (default: NULL) URL to a photo of the item
 * @param {?number} expirationDate (UNIX timestamp); signifies the item is a Perishable type item if not null; default null
 */
async function addItem(shelfOrContainerID, itemTypeName, initialCount=1, description=null, photoURL=null, expirationDate=null) {
    const response = await fetch("/api/add-item", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({
            shelfOrContainerID,
            itemTypeName,
            initialCount,
            description,
            photoURL,
            expirationDate
        })
    });
    if (response.ok) {
        const data = response.json();
        // TODO: update interface
    }
}

const ToggleBar = () => (
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
            <button type="button">Insert Item</button>
        </div>
        <div>
            <button type="button">Insert Containers</button>
        </div>
        <div>
            <button type="button">Insert Shelf</button>
        </div>
    </div>
)

const Header = () => (
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

export default Header;