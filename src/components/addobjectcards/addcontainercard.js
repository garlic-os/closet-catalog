import React from 'react';
import "./objectcardindex.css";
import eventBus from '../../EventBus/eventbus.js';

function AddContainerCard () {
    const containerAttributes = ['ID', 'Size', 'Material'];

    const handleButton = () => {
        eventBus.dispatch("cancel adding container", {message: "cancel adding container"});
    }

    return (
        <div id="itemcard">
            <h2>Add an Container</h2>
            <p>Note: All attributes must be filled upon creation.</p>
            <form>
                
                {
                    containerAttributes.map((attribute) =>
                        <div>
                            <b>{attribute}: </b>
                            <input type={attribute === 'Picture'? "file":"text"} required></input>
                            <br></br><br></br>
                        </div>

                    )
                }
            </form>
            <button className="button" type="button" onClick={handleButton}>Cancel</button>
            <button className="button" type="submit">Add Container</button>
        </div> 
    )
}

export default AddContainerCard;