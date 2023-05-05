import React from 'react';
import "./objectcardindex.css";
import eventBus from '../../EventBus/eventbus.js';
import * as config from "../../config.js";


async function addContainer(event) {
    event.preventDefault();  // Keep the page from reloading
    const response = await fetch(`${config.url}/api/add-container`, {
        method: "POST",
        headers: {
            "Authorization": localStorage.getItem("token")
        },
        body: new FormData(event.target)
    });
    if (response.ok) {
        alert("Sucessfully added Container")
    }
    return false;
}

function AddContainerCard () {
    const items = [
        {
            name: "Name",
            slug: "name",
            type: "text"
        },
        {
            name: "Size",
            slug: "size",
            type: "number"
        },
        {
            name: "Units",
            slug: "units",
            type: "text"
        }
    ]

    // TODO: get shelves from closetData
    let shelves = [
        {
            name: "Default Shelf",
            id: 0
        },
    ];

    const handleButton = () => {
        eventBus.dispatch("cancel adding container");
    }

    let count = 0;
    return (
        <div id="itemcard">
            <h2>Add a Container</h2>
            <p>Note: All attributes must be filled upon creation.</p>
            <form id="itemform" onSubmit={addContainer}>
                {
                    items.map(({ name, slug, type }) =>
                        <div key={count++}>
                            <b>{name}: </b>
                            <input name={slug} type={type}></input>
                            <br/><br/>
                        </div>
                    )
                }
                <select>
                    {
                        shelves.map(({ name, id }) =>
                            <option key={count++} value={id}>{name}</option>
                        )
                    }
                </select>
                <br/><br/>
                <button className="button" type="button" onClick={handleButton}>Cancel</button>
                <input className="button" type="submit" value="Add Container" />
            </form>
        </div>
    )
}

export default AddContainerCard;