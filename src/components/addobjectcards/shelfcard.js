import React from 'react';
import "./objectcardindex.css";

function AddShelfCard() {
    const shelfAttributes = ['Name', 'Sid', 'Size', 'Material', 'Units', 'Value'];
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
            <button className="button" type="button">Cancel</button>
            <button className="button" type="submit">Add Container</button>
        </div> 
    )
}

export default AddShelfCard;