import React from 'react';
import "./objectcardindex.css";
import eventBus from '../../EventBus/eventbus';

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
async function addItem(event) {
    event.preventDefault();  // Keep the page from reloading
    const response = await fetch("http://localhostL3001/api/add-item", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
        },
        body: new FormData(event.target)
    });
    if (response.ok) {
        const data = response.json();
        alert("Sucessfully added Item")
        // TODO: update interface
    }
    return false;
}

function AddItemCard () {
    const itemAttributes = {'Name': 'itemTypeName', 'Picture':'photoURL', 'Quantity': 'initialCount', 'Type':'itemTypeName', 'Expiration Date':'expirationDate'};

    const handleButton = (type) => {
        console.log("applying");
        eventBus.dispatch("cancel adding item", {message: "cancel adding item"});
    }

    let count = 0;
    return (
        <div id="itemcard">
            <h2>Add an Item</h2>
            <p>Note: All attributes must be filled upon creation.</p>
            <form id="itemform" onSubmit={addItem}>
                {
                    Object.keys(itemAttributes).map((attribute) =>
                        <div key={count++}>
                            <b>{attribute}: </b>
                            <input name={itemAttributes[attribute]} type={attribute === 'Picture'? "file":"text"}></input>
                            <br></br><br></br>
                        </div>
                    )
                }
                <button className="button" type="button" onClick={handleButton}>Cancel</button>
                <input className="button" type="submit" value="Add Item" />
            </form>

        </div>            
    )
}

export default AddItemCard;