import React from 'react';
import "./containerview.css";
import ItemCard from '../../components/itemcard/itemcard';
import eventBus from '../../EventBus/eventbus';
import ModifyContainer from '../../components/modifyobjectcards/modifycontainer';
import ModifyItem from '../../components/modifyobjectcards/modifyitem';

class Container extends React.Component {
    constructor(props) {
        super(props);
        this.shelves = props.shelves;
        this.shelf = props.shelf;
        this.containerdata = props.data;
        this.title = props.title;
        this.handleItemClick()
        this.handleItemUNMOUNT()
        this.handlemodifycontainer()
        this.handlemodifyitem()
        this.handlingmodifyitemdidmount()
        this.handlingmodifycontainerdidmount()
        this.state = {
            islookingatitem: false,
            ismodifyingcontainer: false,
            ismodifyingitem: false,
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

    handlemodifycontainer() {
        eventBus.dispatch("modify container", {message: "modify container"});
        this.setState(prevState => ({ismodifyingcontainer:true}));
        this.setState(prevState => ({ismodifyingitem:false}));
        this.setState(prevState => ({islookingatitem:false}));
    }

    handlingmodifycontainerdidmount() {
        eventBus.on("cancel modify container", (data) => {
            console.log("cancel modify container");
            this.setState(prevState => ({ismodifyingcontainer:false}));
        }
        );
    }

    handlemodifyitem() {
        eventBus.on("modify item", (data) => {
            this.setState(prevState => ({ismodifyingcontainer:false}));
            this.setState(prevState => ({ismodifyingitem:true}));
            this.setState(prevState => ({islookingatitem:false}));
        }
        );
    }

    handlingmodifyitemdidmount() {
        eventBus.on("cancel modify item", (data) => {
            console.log("cancel modify item");
            this.setState(prevState => ({ismodifyingitem:false}));
        }
        );
    }

    render() {
        const items = this.containerdata["items"]
        return (
            <div id="containerview">
                {console.log("-------------")}
                {console.log(this.containerdata)}
                {console.log("-------------")}
                <h1>{this.containerdata["name"]}</h1>
                <div id='containertable'>
                    {items && items.map((item) => {
                        return (
                        <div id="containerviewitem" onClick={() => this.handleItemClick(item)}>
                            <h4>{item["name"]}</h4>
                            <img src={item?.photo_url?.replace("public", "")} alt="No Picture" height="50px" />
                            <br></br>
                        </div>
                        );
                    })}
                </div>
                
                {this.state.islookingatitem? <ItemCard name={this.itemdata["name"]} count={this.itemdata["count"]} type={this.itemdata["type"]} exdate={this.itemdata["expiration_date"]} id={this.itemdata["item_id"]}/> : null}
                {this.state.ismodifyingcontainer? <ModifyContainer name={this.containerdata["name"]} size={this.containerdata["size"]} units={this.containerdata["units"]} id={this.containerdata["container_id"]} shelf={this.shelf} shelves={this.shelves}/> : null}
                {this.state.ismodifyingitem? <ModifyItem name={this.itemdata["name"]} count={this.itemdata["count"]} type={this.itemdata["type"]} exdate={this.itemdata["expiration_date"]} id={this.itemdata["item_id"]}/> : null}
                <br></br>
                
                <button type='button' onClick={()=>this.handlemodifycontainer()}>Modify Container</button>
            </div>
        );
    }
}

export default Container