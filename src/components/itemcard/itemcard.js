import React from 'react';
import eventBus from '../../EventBus/eventbus.js';
import './itemcard.css';

const ItemCard = (props) => {

    const handleBackButton = () => {
        eventBus.dispatch("cancel display item", {message: "cancel display item"});
    }

    const handleDeleteItem = () => {
        fetch("/api/delete-item", {
            method: "post",
            body: {
                item_id: document.getElementById("yes")
            }
        });
    }

    return (
        <div id="displayitem">
            <h1>Name</h1>
                <ol>
                    <li>Quantity</li>
                    <li>Type</li>
                    <li>Perishable</li>
                    <li>item ID</li>
                </ol>
            <button type="button" onClick={() => handleBackButton()}>{'<'} Back</button>
            <button type="buttom" onClick={() => handleDeleteItem()}>Remove Item</button>
        </div>
    )
}

export default ItemCard;