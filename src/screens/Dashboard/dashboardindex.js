import React from 'react';
import DashboardHeader from '../../components/dashboardheader/dashboardheader.js';
import './index.css';
import AddItemCard from '../../components/addobjectcards/additemcard.js';
import eventBus from '../../EventBus/eventbus.js';
import AddContainerCard from '../../components/addobjectcards/addcontainercard.js';
import AddShelfCard from '../../components/addobjectcards/addshelfcard.js';
import Container from '../ContainerView/containerview.js';
import ItemCard from '../../components/itemcard/itemcard.js';
import ModifyItem from '../../components/modifyobjectcards/modifyitem.js';
import ModifyShelf from '../../components/modifyobjectcards/modifyshelf.js';


function isAlphaNumeric(keyCode) {
    return (keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90);
}

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
        this.handleModifyItem()
        this.handleModifyItemDidMount()
        this.handleModifyShelf()
        this.handleModifyShelfDidMount()
        this.state = {
            isInsertingItem: false,
            isInsertingContainer: false,
            isInsertingShelf: false,
            showingItems: false,
            showingContainers: false,
            showingShelves: false,
            showingDashboard: true,
            displayItem: false,
            ismodifyingitem: false,
            ismodifyingshelf: false,
            closetData: {},
            closetDataFull: {},
            containerData: {},
            shelfData: {},
            itemData: {},
            shelfInfo: {},
        };
        this.key = 0;
    }

    // Adding and Canceling for Item
    addItemDidMount() {
        eventBus.on("adding item", (data) => {
            this.setState(prevState => ({isInsertingItem:true}));
            this.setState(prevState => ({isInsertingContainer: false}));
            this.setState(prevState => ({isInsertingShelf: false}));
            this.setState(prevState => ({displayItem: false}));
            this.setState(prevState => ({isEditing: false}));            
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
            this.setState(prevState => ({isEditing: false}));            
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
            this.setState(prevState => ({isEditing: false}));            
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

    handleContainer(c, s, n) {
        console.log("is in container container")
        console.log(s);
        this.containerdata = c;
        this.shelfData = {
            shelf_id: s,
            name: n
        };
        eventBus.dispatch("is in container", {message: "is in container"});
    }

    containerDidMount() {
        eventBus.on("is in container", (data) => {
            this.setState(prevState =>({showingDashboard:false}));
            this.setState(prevState =>({showingContainers:true}));
            this.setState(prevState =>({showingItems:false}));
            this.setState(prevState =>({showingShelves:false}));
        }
        );
    }
    
    dispatchDisplayItem(item) {
        this.itemData = item;
        console.log("dispatching display item");
        console.log(this.itemData);
        eventBus.dispatch("display item", {message: "display item"});
    }

    handleDisplayItem() {
        eventBus.on("display item", (data) => {
            this.setState(prevState => ({isInsertingContainer:false}));
            this.setState(prevState => ({isInsertingShelf: false}));
            this.setState(prevState => ({isInsertingItem:false}));
            this.setState(prevState => ({displayItem: true}));
        }
        );
    }

    handleDisplayItemUnMount() {
        eventBus.on("cancel display item", (data) => {
            console.log("HERE");
            this.setState(prevState => ({displayItem: false}));            
        }
        );
    }

    handleModifyItem() {
        eventBus.on("modify item", (data) => {
            this.setState(prevState => ({isInsertingContainer:false}));
            this.setState(prevState => ({isInsertingShelf: false}));
            this.setState(prevState => ({isInsertingItem:false}));
            this.setState(prevState => ({displayItem: false}));
            this.setState(prevState => ({ismodifyingitem: true}));
        }
        );
    }

    handleModifyItemDidMount() {
        eventBus.on("cancel modify item", (data) => {
            this.setState(prevState => ({ismodifyingitem: false}));            
        }
        );
    }

    handleModifyShelf(shelf) {
        this.shelfInfo = shelf;
        eventBus.dispatch("modify shelf", {message: "modify shelf"});
        this.setState(prevState => ({isInsertingContainer:false}));
        this.setState(prevState => ({isInsertingShelf: false}));
        this.setState(prevState => ({isInsertingItem:false}));
        this.setState(prevState => ({displayItem: false}));
        this.setState(prevState => ({ismodifyingshelf: true}));
    }

    handleModifyShelfDidMount() {
        eventBus.on("cancel modify shelf", (data) => {
            this.setState(prevState => ({ismodifyingshelf: false}));            
        }
        );
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
            return await response.json();
        } else {
            const data = await response.json();
            throw new Error(data.error);
        }
    }
//
    async componentDidMount() {
        const closetData = await this.getClosetData();
        this.setState({
            closetData: closetData,
            closetDataFull: closetData
        });
    }


    /**
     * Return a copy of closetData that contains only items, containers, and
     * shelves whose name includes the query
     * 
     * @param {string} query
     * @returns {DashboardCloset}
     */
    handleSearch(event) {
        const closetData = this.state.closetData;
        const nextChar = isAlphaNumeric(event.keyCode) ? event.key : "";
        let query = event.target.value + nextChar;
        query = query.toLowerCase().trim();
        if (event.key === "Backspace") {
            query = query.slice(0, -1);
        }
        if (query === "") {
            console.debug(`[handleSearch] "${query}":`, this.state.closetDataFull);
            this.setState({ closetData: this.state.closetDataFull });
            return;
        }
        const filteredCloset = {
            closet_id: closetData.closet_id,
            name: closetData.name,
            shelves: []
        };
        for (const shelf of closetData.shelves) {
            const filteredShelf = {
                shelf_id: shelf.shelf_id,
                name: shelf.name,
                containers: [],
                items: []
            };
            if (shelf.name.toLowerCase().includes(query)) {
                filteredCloset.shelves.push(shelf);
                continue;
            }
            for (const container of shelf.containers) {
                if (container.name.toLowerCase().includes(query)) {
                    filteredShelf.containers.push(container);
                }
            }
            for (const item of shelf.items) {
                if (item.name.toLowerCase().includes(query)) {
                    filteredShelf.items.push(item);
                }
            }
            if (filteredShelf.containers.length > 0 || filteredShelf.items.length > 0 || shelf.name.toLowerCase().includes(query)) {
                filteredCloset.shelves.push(filteredShelf);
            }
        }
        console.debug(`[handleSearch] "${query}":`, filteredCloset);
        this.setState({ closetData: filteredCloset });
    }

    render() {
        let shelfdata = this.state.closetData["shelves"];
        let myname = "JOHN";
        shelfdata && shelfdata.reverse();

        console.log("[Dashboard]", {shelfdata});
        console.log("--------------------");
        let dashboarddata = <div id="tablecontainer">
            {shelfdata && shelfdata.map((shelf) => {
                return (
                    <div key={this.key++}>
                        {this.state.displayItem? <ItemCard name={this.itemData["name"]} count={this.itemData["count"]} type={this.itemData["type"]} exdate={this.itemData["expiration_date"]} id={this.itemData["item_id"]} itemData={this.itemData}/> : null}
                        {this.state.ismodifyingitem? <ModifyItem item={this.itemData["name"]} count={this.itemData["count"]} type={this.itemData["type"]} exdate={this.itemData["expiration_date"]} id={this.itemData["item_id"]} closetData={this.state.closetData} /> : null}
                        {this.state.ismodifyingshelf? <ModifyShelf shelf={this.shelfInfo} /> : null}
                        <table id="dashboardtable">
                            <tbody>
                                {
                                shelf["containers"].length === 0 && shelf["items"].length === 0
                                    ? <tr id="emptyshelf"><br></br><br></br>empty</tr>
                                    : <tr id='containersanditems'> {
                                        shelf["items"] && shelf["items"].map((item) =>
                                            <td id='item' key={this.key++}><button id='item' className='containeritem' onClick={() => this.dispatchDisplayItem(item)}>{item["name"]}</button></td>
                                        )
                                    }
                                    {
                                        shelf["containers"] && shelf["containers"].map((container) =>
                                            <td id='container' key={this.key++}><button id='container' className='containeritem' onClick={() => this.handleContainer(container, shelf["shelf_id"], shelf["name"])}>{container["name"]}</button></td>
                                        )
                                    }
                                    </tr>
                                }
                                <tr id={shelf["name"]} className='shelf'>
                                    <td>{shelf["name"]}</td>
                                    <td><button id='shelf' className='containeritem' onClick={() => this.handleModifyShelf(shelf)}>edit</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div> 

        return (
            <div id="dashboard">
                <DashboardHeader handleSearch={this.handleSearch.bind(this)} />
                {
                    this.state.isInsertingItem &&
                    !(this.state.isInsertingContainer) &&
                    !(this.state.isInsertingShelf) &&
                    !(this.state.displayItem) &&
                    !(this.state.isEditing)&&
                    <AddItemCard closetData={this.state.closetData} />
                }
                {
                    (this.state.isInsertingContainer) &&
                    !(this.state.isInsertingItem) &&
                    !(this.state.isInsertingShelf) &&
                    !(this.state.displayItem) &&
                    !(this.state.isEditing)&&
                    <AddContainerCard closetData={this.state.closetData} />
                }
                {
                    (this.state.isInsertingShelf) &&
                    !(this.state.isInsertingItem) &&
                    !(this.state.isInsertingContainer) &&
                    !(this.state.displayItem) &&
                    !(this.state.isEditing)&&
                    <AddShelfCard closetData={this.state.closetData} />
                }
                {
                    !(this.state.isInsertingShelf) &&
                    !(this.state.isInsertingItem) &&
                    !(this.state.isInsertingContainer) &&
                    !(this.state.isEditing)&&
                    (this.state.displayItem) &&
                    <ItemCard />
                }
                {this.state.showingDashboard?
                    <div>
                        <h1>Dashboard</h1>
                        {dashboarddata}
                    </div>
                    :                    
                    <Container data={this.containerdata} shelf={this.shelfData} shelves={this.state.closetData["shelves"]}/>
                }
            </div>
        )
    }
}

export default Dashboard;