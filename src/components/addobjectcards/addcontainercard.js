import React from 'react';
import "./objectcardindex.css";
import eventBus from '../../EventBus/eventbus.js';
import * as config from "../../config.js";

function AddContainerCard () {
    const containerAttributes = ['ID', 'Size', 'Material'];

    const handleButton = () => {
        eventBus.dispatch("cancel adding container", {message: "cancel adding container"});
    }

    //THIS DOES NOT WORK, THE FORM IT SUPPLING NULL VALUES TO POST REQUEST
    async function addContainer(event) { 
        console.log("hi");
        event.preventDefault();
        const response = await fetch(`${config.url}/api/add-container`, {
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

    return (
        <div id="itemcard">
            <h2>Add an Container</h2>
            <p>Note: All attributes must be filled upon creation.</p>
            <form id = "containerform" onSubmit={addContainer}>
                
                {
                    containerAttributes.map((attribute) =>
                        <div>
                            <b>{attribute}: </b>
                            <input type={attribute === 'Picture'? "file":"text"} required></input>
                            <br></br><br></br>
                        </div>

                    )
                }
                <button className="button" type="button" onClick={handleButton}>Cancel</button>
                <input className="button" type="submit" value = "Add Container"/>
            </form>
        </div> 
    )
}

export default AddContainerCard;