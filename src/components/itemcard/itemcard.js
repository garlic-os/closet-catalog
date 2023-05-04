import React from 'react';
import eventBus from '../../EventBus/eventbus';
import './itemcard.css';

const ItemCard = (props) => {

    const handleBackButton = () => {
        eventBus.dispatch("cancel display item", {message: "cancel display item"});
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
            <button type="buttom">Remove Item</button>
        </div>
    )
}

export default ItemCard;