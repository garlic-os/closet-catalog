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
        this.dispatchDisplayItem()
        this.handleDisplayItem()
        this.handleDisplayItemUnMount()
        this.state = {
                        isInsertingItem: false,
                        isInsertingContainer: false,
                        isInsertingShelf: false,
                        showingItems: false,
                        showingContainers: false,
                        showingShelves: false,
                        showingDashboard: true,
                        displayItem: false,
                        closetdata: {}
                    };
        
    }

    // Adding and Canceling for Item
    addItemDidMount() {
        eventBus.on("adding item", (data) => {
            this.setState(prevState => ({isInsertingItem:true}));
            this.setState(prevState => ({isInsertingContainer: false}));
            this.setState(prevState => ({isInsertingShelf: false}));
            this.setState(prevState => ({displayItem: false}));
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
            this.setState(prevState => ({displayItem: false}));
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
            this.setState(prevState => ({displayItem: false}));
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

    dispatchDisplayItem() {
        eventBus.dispatch("display item", {message: "display item"});
    }

    handleDisplayItem() {
        eventBus.on("display item", (data) => {
            this.setState(prevState => ({isInsertingShelf: false}));
            this.setState(prevState => ({isInsertingContainer: false}));
            this.setState(prevState => ({isInsertingItem:false}));
            this.setState(prevState => ({displayItem: true}));
        }
        );
    }

    handleDisplayItemUnMount() {
        eventBus.on("cancel display item", (data) => {
            console.log("HERE")
            this.setState(prevState => ({displayItem: false}));
        }
        );
    }

    componentDidMount() {
        this.getClosetData();
    }

    async getClosetData() {
        let closets;
        {
            const response = await fetch('http://localhost:3001/api/closets', {
                headers:{'authorization': localStorage.getItem('token')}
            });
            if (response.ok) {
                closets = await response.json();
            } else {
                const data = await response.json();
                alert(data.error);
            }
        }
        const response = await fetch(`http://localhost:3001/api/closet/${closets[0].closet_id}`, {
            headers:{'authorization': localStorage.getItem('token')}
        });
        if (response.ok) {
            const closetdata = await response.json();
            this.setState({ closetdata });
        } else {
            const data = await response.json();
            alert(data.error);
        }
    }

    render() {
        let testArray = ["1", "2", "3"]
        const shelfdata = this.state.closetdata["shelves"]
        shelfdata && shelfdata.reverse()

        console.log("AHHH")
        console.log(shelfdata)

        const testinglist = Object.keys(this.state.closetdata).map((object) => {
            return (
                <div>
                    <p>{object}</p>
                    {JSON.stringify(object) == "shelves"? <h1>hi</h1> : <h2>bye</h2>}
                </div>
            );
        });

        let myvariable = <h1>hi

        </h1>

        let dashboarddata = <div id="tablecontainer">
                {shelfdata && shelfdata.map((shelf) => {
                return (
                    <div>
                        <table id="dashboardtable">
                            <tbody>
                                {shelf["containers"].length === 0 && shelf["items"].length === 0? <tr id="emptyshelf"><br></br><br></br>empty shelf</tr>:
                                    <tr id='containersanditems'>
                                    {shelf["items"] && shelf["items"].map((item) => {
                                        return (
                                            <td><button id='item' className='containeritem'>{item["name"]}</button></td>
                                        );
                                    })
                                    }
                                    {shelf["containers"] && shelf["containers"].map((container) => {
                                        return (
                                            
                                            <td id='container'><button id='container' className='containeritem'>{container["name"]}</button></td>
                                        );
                                    })
                                    }
                                    </tr>
                                }
                                <tr id={shelf["name"]} className='shelf'>
                                    <p>{shelf["name"]}</p>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );
                })}
        </div> 

        return (
            <div id="dashboard">
                <DashboardHeader />
                {(this.state.isInsertingItem) && !(this.state.isInsertingContainer) && !(this.state.isInsertingShelf) && !(this.state.displayItem) && <AddItemCard closetData={this.state.closetData} /> }
                {(this.state.isInsertingContainer) && !(this.state.isInsertingItem) && !(this.state.isInsertingShelf) && !(this.state.displayItem) && <AddContainerCard closetData={this.state.closetData} /> }
                {(this.state.isInsertingShelf) && !(this.state.isInsertingItem) && !(this.state.isInsertingContainer) && !(this.state.displayItem) && <AddShelfCard closetData={this.state.closetData} /> }
                {!(this.state.isInsertingShelf) && !(this.state.isInsertingItem) && !(this.state.isInsertingContainer) && (this.state.displayItem) && <ItemCard />}
                {this.state.showingDashboard?
                    <div id="dashboardcontainer">
                        {console.log('hi')}
                        {console.log(this.state.closetdata)}
                        {console.log(this.state.closetdata["closet_id"])}
                        {console.log("TESTING")}
                        {console.log(this.state.closetdata["shelves"])}
                        
                        <h1>Dashboard</h1>
                        {/* {console.log("TESTING")}
                        {console.log(this.state.closetdata["shelves"])}
                        {console.log(typeof this.state.closetdata)}
                        {console.log("HERE")}
                        {console.log(this.state.closetdata["closet_id"])} */}
                        {/* {console.log(closetData)} */}
                        {dashboarddata}

                    </div>
                    :
                    <Container />
                }
            </div>
        )
    }

}

export default Dashboard;