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

    const handleButton = () => {
        eventBus.dispatch("cancel modify shelf");
    }


    return (
        <div id="modifycard">
            <h1>Modify <br></br>{props.name}</h1>
            <form onSubmit={props.handleSubmit}>
                {
                    items.map(({ name, slug, type }) =>
                        <div>
                            <b>{name}: </b>
                            <input name={slug} type={type}></input>
                            <br/><br/>
                        </div>
                )}
            </form>
            <button className="button" type="button" onClick={() =>handleButton()}>Cancel</button>
            <button className="button" type="button">Delete</button>
            <input className="button" type="submit" value="Submit Changes" />
        </div>
    )
}

export default ModifyContainer;