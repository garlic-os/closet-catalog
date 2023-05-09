import React from 'react';
import "./modifyobject.css";
import eventBus from '../../EventBus/eventbus.js';
import * as config from "../../config.js";

function ModifyContainer(props) {
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
        eventBus.dispatch("cancel modify shelf");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        console.log(event.target);
        const response = await fetch(`${config.url}/api/edit-shelf`, {
            method: "POST",
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            body: new FormData(event.target)
        });
        if(response.ok)
        {
            window.location.reload();
            alert("successfully modified item");
        }
    }

    async function handleDelete(event) {
        event.preventDefault();
        console.log(event.target.value);
        const response = await fetch(`${config.url}/api/delete-shelf`, {
            method: "POST",
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            body: new FormData(event.target)
        })
        if(response.ok)
        {
            window.location.reload();
            alert("successfully deleted item");
        }
    }


    return (
        <div id="modifycard">
            {console.log(props)}
            <h1>Modify <br></br>{props["shelf"].name}</h1>
            <form onSubmit={handleSubmit}>
                {
                    items.map(({ name, slug, type }) =>
                        <div>
                            <b>{name}: </b>
                            <input name={slug} type={type}></input>
                            <br/><br/>                            
                        </div>
                )}
                {/* Below is the shelf ID */}
                <p>Shelf ID:{props["shelf"]["shelf_id"]}</p>
                <input type="hidden" name = "shelf_id" value={props["shelf"]["shelf_id"]}></input>
                <input className="button" type="submit" value="Submit Changes" />
            </form>
            <button className="button" type="button" onClick={() =>handleButton()}>Cancel</button>
            <form onSubmit={handleDelete}>
                <input type="hidden" name="shelf_id" value={props["shelf"]["shelf_id"]}/>
                <input className="button" type="submit" value="Delete" />
            </form>
        </div>
    )
}

export default ModifyContainer;