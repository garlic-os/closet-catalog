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

    async function handleSubmit(event) {
        event.preventDefault();
        const response = await fetch(`${config.url}/api/edit-container`, {
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
    console.log(props.shelves)
    let count = 0;
    return (
        <div id="modifycard">
            <h1>Modify <br></br>{props.name}</h1>
            <form onSubmit={handleSubmit}>
                {
                    items.map(({ name, slug, type }) =>
                        <div key = {count++}>
                            <b>{name}: </b>
                            <input name={slug} type={type}></input>
                            <br/><br/>
                        </div>
                    )
                }
                <b>New Shelf: </b>
                <select name="shelf_id" id="shelf_id">
                    {
                        props.shelves.map(({name, shelf_id}) => 
                            <option key={count++} value={shelf_id}>{name}</option>
                        )
                    }
                </select>
                <p>ID: {props.id}</p>
                <p>Current shelf: {props.shelf["name"]}</p>
                <input type="hidden" value={props.id} name="container_id"></input>
                <button className="button" type="button">Cancel</button>
                <button className="button" type="button">Delete</button>
                <input className="button" type="submit" value="Submit Changes" />
            </form>
        </div>
    )
}

export default ModifyContainer;