import React from 'react';
import "./objectcardindex.css";
import eventBus from '../../EventBus/eventbus.js';
import * as config from "../../config.js";


async function addItem(event) {
    event.preventDefault();  // Keep the page from reloading
    const response = await fetch(`${config.url}/api/add-item`, {
        method: "POST",
        headers: {
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
    const items = [
        {
            name: "Name",
            slug: "name",
            type: "text"
        },
        {
            name: "Picture",
            slug: "photo",
            type: "file"
        },
        {
            name: "Quantity",
            slug: "initialCount",
            type: "number"
        },
        {
            name: "Type",
            slug: "itemTypeName",
            type: "text"
        },
        {
            name: "Expiration Date",
            slug: "expirationDate",
            type: "date"
        }
    ]

    // TODO: get shelves and containers from database
    let shelvesAndContainers = [
        {
            name: "Default Shelf",
            id: 0
        },
    ];

    const handleButton = () => {
        eventBus.dispatch("cancel adding item", {message: "cancel adding item"});
    }

    let count = 0;
    return (
        <div id="itemcard">
            <h2>Add an Item</h2>
            <p>Note: All attributes must be filled upon creation.</p>
            <form id="itemform" onSubmit={addItem}>
                {
                    items.map(({ name, slug, type }) =>
                        <div key={count++}>
                            <b>{name}: </b>
                            <input name={slug} type={type} required></input>
                            <br/><br/>
                        </div>
                    )
                }
                <select>
                    {
                        shelvesAndContainers.map(({ name, id }) =>
                            <option key={count++} value={id}>{name}</option>
                        )
                    }
                </select>
                <br/><br/>
                <button className="button" type="button" onClick={handleButton}>Cancel</button>
                <input className="button" type="submit" value="Add Item" />
            </form>
        </div>
    )
}

export default AddItemCard;