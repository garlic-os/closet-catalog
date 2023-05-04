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
        this.cancelAddItem()
        this.addContainerDidMount()
        this.cancelAddContainer()
        this.addShelfDidMount()
        this.cancelAddShelf()
        this.showingItemsDidMount()
        this.showingContainersDidMount()
        this.showingShelvesDidMount()
        this.state = {isInsertingItem: false, isInsertingContainer: false, isInsertingShelf: false,
                        showingItems: false, showingContainers: false, showingShelves: false};
    }

    // Adding and Canceling for Item
    addItemDidMount() {
        eventBus.on("adding item", (data) => {
            this.setState(prevState => ({isInsertingItem:true}));
            this.setState(prevState => ({isInsertingContainer: false}));
            this.setState(prevState => ({isInsertingShelf: false}));
            }
        );
    }

    cancelAddItem() {
        eventBus.on("cancel adding item", (data) => {
            this.setState(prevState => ({isInsertingItem:false}));
        });
    }

    // Adding and Canceling for Container
    addContainerDidMount() {
        eventBus.on("adding container", (data) => {
            this.setState(prevState => ({isInsertingContainer:true}));
            this.setState(prevState => ({isInsertingShelf: false}));
            this.setState(prevState => ({isInsertingItem:false}));
        }
        );
    }

    cancelAddContainer() {
        eventBus.on("cancel adding container", (data) => {
            this.setState(prevState => ({isInsertingContainer: false}));
        }
        );
    }

    // Adding and Canceling for Shelf
    addShelfDidMount() {
        eventBus.on("adding shelf", (data) => {
            this.setState(prevState => ({isInsertingShelf: true}));
            this.setState(prevState => ({isInsertingContainer: false}));
            this.setState(prevState => ({isInsertingItem:false}));
        }
        );
    }

    cancelAddShelf() {
        eventBus.on("cancel adding shelf", (data) => {
            this.setState(prevState => ({isInsertingShelf: false}));
        }
        );
    }

    showingItemsDidMount() {
        eventBus.on("showing items", (data) => {
            this.setState(prevState => ({showingItems:!prevState.showingItems}));
        }
        );
    }

    showingContainersDidMount() {
        eventBus.on("showing containers", (data) => {
            this.setState(prevState => ({showingContainers:!prevState.showingContainers}));            
        }
        );
    }

    showingShelvesDidMount() {
        eventBus.on("showing shelves", (data) => {
            this.setState(prevState => ({showingShelves:!prevState.showingShelves}));
        }
        );
    }

    render() {
        return (
            <div id="dashboard">
            <DashboardHeader />
            {(this.state.isInsertingItem) && !(this.state.isInsertingContainer) && !(this.state.isInsertingShelf) && <AddItemCard /> }
            {(this.state.isInsertingContainer) && !(this.state.isInsertingItem) && !(this.state.isInsertingShelf) && <AddContainerCard /> }
            {(this.state.isInsertingShelf) && !(this.state.isInsertingItem) && !(this.state.isInsertingContainer) && <AddShelfCard /> }
            <h1>Dashboard</h1>
            {this.state.showingItems && <h1>Showing Items</h1>}
            {this.state.showingContainers && <h1>Showing Containers</h1>}
            {this.state.showingShelves && <h1>Showing Shelves</h1>}
            </div>
        )
    }

}

export default Dashboard;