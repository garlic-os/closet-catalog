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
        window.location.reload();
        // TODO: update interface
    }
    
    return false;
}

let Cdata;

async function getClosetData() {
    let closets;
    {
        const response = await fetch('http://localhost:3001/api/closets', {
            headers:{'authorization': localStorage.getItem('token')}
        });
        if (response.ok) {
            closets = await response.json();
        } else {
            const data = await response.json();
            alert(data.error);
        }
    }
    const response = fetch(`http://localhost:3001/api/closet/${closets[0].closet_id}`, {
        method: "GET",
        headers:{'authorization': localStorage.getItem('token')}
    });
    Cdata = await (await response).json();
    console.log("id");
    console.log(Cdata.shelves);
}
getClosetData();

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
                            <input name={slug} type={type}></input>
                            <br/><br/>
                        </div>
                    )
                }
                <b>shelves: </b>
                <select id = "shelves" name = "shelf_id">
                    {
                        Cdata.shelves.map(({ name, shelf_id }) =>
                            <option key={count++} value={shelf_id}>{name}</option>
                        )
                    }
                </select>
                <br></br>
                <b>containers: </b>
                <select id = "containers" name = "container_id">
                    {
                        Cdata.containers.map(({ name, container_id }) =>
                            <option key={count++} value={container_id}>{name}</option>
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