import React from 'react';
import DashboardHeader from "../../components/dashboardheader/dashboardheader.js";
import "./index.css";
import AddItemCard from "../../components/addobjectcards/itemcard.js";
import eventBus from '../../EventBus/eventbus.js';
import AddContainerCard from '../../components/addobjectcards/containercard.js';
import AddShelfCard from '../../components/addobjectcards/shelfcard.js';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.addItemDidMount()
        this.componentCancelAddItem()
        this.state = {isInsertingItem: false, isInsertingContainer: false, isInsertingShelf: false};
        this.handleButtons = this.handleButtons.bind(this);
    }

    handleButtons(type) {
        if (type === "item") {
            this.setState(prevState => ({isInsertingItem:!prevState.isInsertingItem}));
        } else if (type === "container") {
            this.setState(prevState => ({isInsertingContainer:!prevState.isInsertingContainer}));
        } else {
            this.setState(prevState => ({isInsertingShelf:!prevState.isInsertingShelf}))
        }
    }

    addItemDidMount() {
        eventBus.on("adding item", (data) => {
            this.setState(prevState => ({isInsertingItem:true}));
            // this.setState(this.handleButtons("item"));
            console.log(this.state.isInsertingItem);
            console.log("did mount");
            }
        );
    }

    // Don't think I need this
    // componentWillUnmount() {
    //     console.log("trying to unmount");
    //     eventBus.remove("adding item");
    // }

    componentCancelAddItem() {
        eventBus.on("cancel adding item", (data) => {
            console.log(this.state.isInsertingItem);
            this.setState(prevState => ({isInsertingItem:false}));
        });
    }

    render() {
        return (
            <div id="dashboard">
            <DashboardHeader />
            {this.state.isInsertingItem && <AddItemCard /> }
            <h1>Dashboard</h1>
            
            </div>
        )
    }

}

export default Dashboard;