import React from 'react';
import "./modifyobject.css";
import eventBus from '../../EventBus/eventbus.js';

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
    return (
        <div id="modifycontainer">
            <h1>Modify <br></br>{props.name}</h1>
            <form onSubmit={props.handleSubmit}>
                {
                    items.map(({ name, slug, type }) =>
                        <div>
                            <b>{name}: </b>
                            <input name={slug} type={type}></input>
                            <br/><br/>
                        </div>
                    )
                }
                <p>ID: {props.id}</p>
                <button className="button" type="button">Cancel</button>
                <button className="button" type="button">Delete</button>
                <input className="button" type="submit" value="Submit Changes" />
            </form>
        </div>
    )
}

export default ModifyContainer;