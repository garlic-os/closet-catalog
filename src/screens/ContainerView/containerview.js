import React from 'react';
import "./containerview.css";
import ItemCard from '../../components/itemcard/itemcard';
import eventBus from '../../EventBus/eventbus';

class Container extends React.Component {
    constructor(props) {
        super(props);
        this.containerdata = props.data;
        this.title = props.title;
        this.handleItemClick()
        this.handleItemUNMOUNT()
        this.state = {
            islookingatitem: false,
            itemdata: {}
        };
    }

    handleItemClick(i) {
        this.itemdata = i;
        eventBus.dispatch("display item in container", {message: "display item"});
        this.setState(prevState => ({islookingatitem:true}));
    }

    handleItemUNMOUNT() {
        eventBus.on("cancel display item", (data) => {
            console.log("cancel display item");
            this.setState(prevState => ({islookingatitem:false}));
        }
        );
    }

    render() {
        const items = this.containerdata["items"]
        return (
            <div id="containerview">
                <h1>{this.containerdata["name"]}</h1>
                <div id='containertable'>
                    {items && items.map((item) => {
                        return (
                        <div id="containerviewitem" onClick={() => this.handleItemClick(item)}>
                            <h4>{item["name"]}</h4>
                            <img src={item["photo_url"] && "../../../"+item["photo_url"].slice(7)} alt="No Picture" height="50px"></img>
                        </div>
                        );
                    })}
                </div>
                {this.state.islookingatitem? <ItemCard name={this.itemdata["name"]} count={this.itemdata["count"]} type={this.itemdata["type"]} exdate={this.itemdata["expiration_date"]}/> : null}
            </div>
        );
    }
}

export default Container