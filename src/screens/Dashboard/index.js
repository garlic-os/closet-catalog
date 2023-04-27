import React from 'react';
import Header from "../../components/Header/index.js";
import "./index.css";
import Shelf from "../../components/shelf/index.js";

const Dashboard = () => (
    <div id="dashboard">
        <Header />
        <h1>Dashboard</h1>
        <Shelf />
    </div>
)

export default Dashboard;