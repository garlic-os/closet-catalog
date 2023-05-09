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
    return (
        <div id="modifyitemcard">
            <h2>Modify an Item</h2>
            <form onSubmit={addItem}>
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

export default ModifyContainer;