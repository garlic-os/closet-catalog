import React from 'react';
import DashboardHeader from '../../components/dashboardheader/dashboardheader.js';
import './index.css';
import AddItemCard from '../../components/addobjectcards/additemcard.js';
import eventBus from '../../EventBus/eventbus.js';
import AddContainerCard from '../../components/addobjectcards/addcontainercard.js';
import AddShelfCard from '../../components/addobjectcards/addshelfcard.js';
import Container from '../ContainerView/containerview.js';
import ItemCard from '../../components/itemcard/itemcard.js';

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
        this.showingDashboardDidMount()
        this.containerDidMount()
        this.handleContainer()
        this.state = {
                        isInsertingItem: false,
                        isInsertingContainer: false,
                        isInsertingShelf: false,
                        showingItems: false,
                        showingContainers: false,
                        showingShelves: false,
                        showingDashboard: true,
                    };
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

    // Flips the state of showing items
    showingItemsDidMount() {
        eventBus.on("showing items", (data) => {
            this.setState(prevState => ({showingItems:!prevState.showingItems}));
        }
        );
    }

    // Flips the state of showing containers
    showingContainersDidMount() {
        eventBus.on("showing containers", (data) => {
            this.setState(prevState => ({showingContainers:!prevState.showingContainers}));            
        }
        );
    }

    // Flips the state of showing shelves
    showingShelvesDidMount() {
        eventBus.on("showing shelves", (data) => {
            this.setState(prevState => ({showingShelves:!prevState.showingShelves}));
        }
        );
    }

    // Listens for database and listens accordingly
    showingDashboardDidMount() {
        eventBus.on("is in dashboard", (data) => {
            this.setState(prevState =>({showingDashboard:true}));
        }  
        );
    }

    handleContainer() {
        console.log("adding container")
        eventBus.dispatch("is in container", {message: "is in container"});
    }

    containerDidMount() {
        eventBus.on("is in container", (data) => {
            this.setState(prevState =>({showingDashboard:false}));
            this.setState(prevState =>({showingContainers:false}));
            this.setState(prevState =>({showingItems:false}));
            this.setState(prevState =>({showingShelves:false}));
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

                {this.state.showingDashboard?
                    <div>
                    <h1>Dashboard</h1>
                    {this.state.showingItems && <div><h1>Showing Items</h1><button type="button">Dummy Item</button></div>}
                    {this.state.showingContainers && <div><h1>Showing Containers</h1><button type="button" onClick={() => this.handleContainer()}>Dummy Container</button></div>}
                    {this.state.showingShelves && <h1>Showing Shelves</h1>}
                    </div>
                    :
                    <Container />
                }
            </div>
        )
    }

}

export default Dashboard;