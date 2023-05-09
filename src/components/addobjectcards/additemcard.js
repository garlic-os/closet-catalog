import React from 'react';
import "./objectcardindex.css";
import eventBus from '../../EventBus/eventbus.js';
import * as config from "../../config.js";


async function addItem(event) {
    event.preventDefault();  // Keep the page from reloading
    const response = await fetch(`${config.url}/api/add-item`, {
        method: "POST",
        headers: {
            "Authorization": localStorage.getItem("token")
        },
        body: new FormData(event.target)
    });
    if (response.ok) {
        const data = response.json();
        alert("Sucessfully added Item")
        window.location.reload();
        // TODO: update interface
    }
    
    return false;
}


class AddItemCard extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = { selectedShelf: this.props.closetData.shelves[0] };
        this.items = [
            {
                name: "Name",
                slug: "name",
                type: "text"
            },
            {
                name: "Picture",
                slug: "photo",
                type: "file"
            },
            {
                name: "Quantity",
                slug: "initialCount",
                type: "number"
            },
            {
                name: "Type",
                slug: "itemTypeName",
                type: "text"
            },
            {
                name: "Expiration Date",
                slug: "expirationDate",
                type: "date"
            }
        ]
    };

    handleButton() {
        eventBus.dispatch("cancel adding item", {message: "cancel adding item"});
    }

    handleSelectShelf(event) {
        const shelf_id = parseInt(event.target.value);
        const selectedShelf = this.props.closetData.shelves
            .find(shelf => shelf.shelf_id === shelf_id);
        this.setState({ selectedShelf });
    }

    render() {
        return (
            <div id="itemcard">
                <h2>Add an Item</h2>
                <p>Note: All attributes must be filled upon creation.</p>
                <form id="itemform" onSubmit={addItem}>
                    {
                        this.items.map(({ name, slug, type }) =>
                            <div key={this.count++}>
                                <b>{name}: </b>
                                <input name={slug} type={type} />
                                <br/><br/>
                            </div>
                        )
                    }
                    <b>shelves: </b>
                    <select id="shelves" name="shelf_id" onChange={this.handleSelectShelf.bind(this)}>
                        {
                            this.props.closetData.shelves.map(({ name, shelf_id }) =>
                                <option key={this.count++} value={shelf_id}>{name}</option>
                            )
                        }
                    </select>
                    <br></br>
                    <b>containers: </b>
                    <select id="containers" name="container_id">
                        {
                            this.state.selectedShelf.containers.map(({ name, container_id }) =>
                                <option key={this.count++} value={container_id}>{name}</option>
                            )
                        }
                    </select>
                    <br/><br/>
                    <button className="button" type="button" onClick={this.handleButton}>Cancel</button>
                    <input className="button" type="submit" value="Add Item" />
                </form>
            </div>
        )
    }
}

export default AddItemCard;
