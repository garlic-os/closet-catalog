import React from 'react';
import "./modifyobject.css";
import eventBus from '../../EventBus/eventbus.js';
import * as config from "../../config.js";

class ModifyItem extends React.Component {

    constructor(props) {
        super(props);
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
    }

    handleButton() {
        eventBus.dispatch("cancel modify item");
    }

    handleSelectShelf(event) {
        const shelf_id = parseInt(event.target.value);
        const selectedShelf = this.props.closetData.shelves
            .find(shelf => shelf.shelf_id === shelf_id);
        this.setState({ selectedShelf });
    }

    async handleSubmit(event) {
        event.preventDefault();
        console.log(event.target);
        const response = await fetch(`${config.url}/api/edit-item`, {
            method: "POST",
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            body: new FormData(event.target)
        });
        if(response.ok)
        {
            window.location.reload();
            alert("successfully modified item");
        }
    }

    async handleDelete(event) {
        event.preventDefault();
        console.log(event.target.value);
        const response = await fetch(`${config.url}/api/delete-item`, {
            method: "POST",
            body: new FormData(event.target)
        })
        if(response.ok)
        {
            window.location.reload();
            alert("successfully deleted item");
        }
    }

    render()  {
        return(
        <div id="modifycard">
            <h2>Modify {this.props.name}</h2>
            <form onSubmit={this.handleSubmit}>
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
            <p>Item ID: {this.props.id}</p>
            <input type="hidden" name="item_id" value={this.props.id}/>
            <input className="button" type="submit" value="Submit Changes" />
            </form>
            <button className="button" type="button" onClick={() =>this.handleButton()}>Cancel</button>
            <form onSubmit={this.handleDelete}>
                <input type="hidden" name="item_id" value={this.props.id}/>
                <input className="button" type="submit" value="Delete"/>
            </form>
        </div>
        )
    }
}

export default ModifyItem;