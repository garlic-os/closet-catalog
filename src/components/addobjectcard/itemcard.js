import React from 'react';
import "./objectcardindex.css";

function AddItemCard () {
    const itemAttributes = ['Name', 'Picture', 'Quantity', 'Type', 'Perishable', 'ItemNo'];
    return (
        <div id="itemcard">
            <h2>Add an Item</h2>
            <p>Note: All attributes must be filled upon creation.</p>
            <form>
                
                {
                    itemAttributes.map((attribute) =>
                        <div>
                            <b>{attribute}: </b>
                            <input type={attribute === 'Picture'? "file":"text"}></input>
                            <br></br><br></br>
                        </div>

                    )
                }
            </form>
            <button className="button" type="submit">Cancel</button>
            <button className="button" type="button">Add Item</button>
        </div>            
    )
}

export default AddItemCard;