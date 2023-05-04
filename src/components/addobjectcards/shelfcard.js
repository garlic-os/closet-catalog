import React from 'react';
import "./objectcardindex.css";
import eventBus from '../../EventBus/eventbus.js';

function AddShelfCard() {
    const shelfAttributes = ['Name', 'Sid', 'Size', 'Material', 'Units', 'Value'];

    const handleButton = () => {
        eventBus.dispatch("cancel adding shelf", {message: "cancel adding shelf"});
    }

    return (
        <div id="itemcard">
            <h2>Add a Shelf</h2>
            <p>Note: All attributes must be filled upon creation.</p>
            <form>
                {
                    shelfAttributes.map((attribute) =>
                        <div>
                            <b>{attribute}: </b>
                            <input type={attribute === 'Picture'? "file":"text"}></input>
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

export default AddShelfCard;