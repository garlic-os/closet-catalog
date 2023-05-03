import React from 'react';
import Header from "../../components/dashboardheader/dashboardheader.js";
import "./index.css";
import Shelf from "../../components/shelf/shelf.js";
import AddItemCard from "../../components/addobjectcard/itemcard.js";
import AddContainerCard from '../../components/addobjectcard/containercard.js';
import AddShelfCard from '../../components/addobjectcard/shelfcard.js';

const Dashboard = () => (
    <div id="dashboard">
        <Header />
        <h1>Dashboard</h1>
        <Shelf />
        <AddShelfCard/>
    </div>
)

export default Dashboard;