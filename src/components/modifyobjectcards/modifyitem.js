import React from 'react';
import "./modifyobject.css";
import eventBus from '../../EventBus/eventbus.js';

class  ModifyItem extends React.Component {

    constructor(props) {
        super(props);
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

    render()  {
        return(
        <div id="modifycard">
            <h2>Modify {this.props.name}</h2>
            <form>
            {
                this.items.map(({ name, slug, type }) =>
                    <div key={this.count++}>
                        <b>{name}: </b>
                        <input name={slug} type={type} />
                        <br/><br/>
                    </div>
                )
            }
            </form>
            <button className="button" type="button" onClick={() =>this.handleButton()}>Cancel</button>
            <button className="button" type="button">Delete</button>
            <input className="button" type="submit" value="Submit Changes" />
        </div>
        )
    }
}

export default ModifyItem;