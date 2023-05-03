import React from 'react';
import Header from "../../components/dashboardheader/dashboardheader.js";
import "./index.css";
import Shelf from "../../components/shelf/shelf.js";
import AddItemCard from "../../components/addobjectcards/itemcard.js";
import AddContainerCard from '../../components/addobjectcards/containercard.js';
import AddShelfCard from '../../components/addobjectcards/shelfcard.js';

const Dashboard = () => (
    <div id="dashboard">
        <Header />
        <h1>Dashboard</h1>
        <Shelf />
        <AddShelfCard/>
        <AddContainerCard/>
        <AddItemCard/>
    </div>
)

export default Dashboard;