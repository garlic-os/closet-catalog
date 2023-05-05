import React from 'react';
import "./objectcardindex.css";
import eventBus from '../../EventBus/eventbus.js';
import * as config from "../../config.js";


async function addShelf(event) {
    event.preventDefault();  // Keep the page from reloading
    const response = await fetch(`${config.url}/api/add-shelf`, {
        method: "POST",
        headers: {
            "Authorization": localStorage.getItem("token")
        },
        body: new FormData(event.target)
    });
    if (response.ok) {
        alert("Sucessfully added Shelf")
    }
    return false;
}

function AddShelfCard (props) {
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

    const handleButton = () => {
        eventBus.dispatch("cancel adding shelf");
    }

    let count = 0;
    return (
        <div id="itemcard">
            <h2>Add a Shelf</h2>
            <p>Note: All attributes must be filled upon creation.</p>
            <form id="itemform" onSubmit={addShelf}>
                {
                    items.map(({ name, slug, type }) =>
                        <div key={count++}>
                            <b>{name}: </b>
                            <input name={slug} type={type}></input>
                            <br/><br/>
                        </div>
                    )
                }
                <input type="hidden" name="closet_id" value={props.closet_id} />
                <br/><br/>
                <button className="button" type="button" onClick={handleButton}>Cancel</button>
                <input className="button" type="submit" value="Add Shelf" />
            </form>
        </div>
    )
}

export default AddShelfCard;