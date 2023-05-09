import React from 'react';
import "./objectcardindex.css";
import eventBus from '../../EventBus/eventbus.js';
import * as config from "../../config.js";


// class containerCard extends React.Component{
//     constructor() {
//         super();
//         this.state = {
//             closetData: {}
//         };
//     }

//     componentDidMount() {
//         this.getShelfData();
//     }

// }

async function addContainer(event) {
    event.preventDefault();  // Keep the page from reloading
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
    const response = await fetch(`${config.url}/api/add-container/${closets[0].closet_id}`, {
        method: "POST",
        headers: {
            "Authorization": localStorage.getItem("token")
        },
        body: new FormData(event.target)
    });
    if (response.ok) {
        window.location.reload();
        alert("Sucessfully added Container")
    }
    return false;
}

let id;
async function getShelfData() {
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
    const response = fetch(`http://localhost:3001/api/closet/${closets[0].closet_id}`, {
        method: "GET",
        headers:{'authorization': localStorage.getItem('token')}
    });
    id = await (await response).json();
    console.log("id");
    console.log(id.shelves);
}
getShelfData();

function AddContainerCard () {
    const items = [
        {
            name: "Name",
            slug: "name",
            type: "text"
        },
        {
            name: "Size",
            slug: "size",
            type: "number"
        },
        {
            name: "Units",
            slug: "units",
            type: "text"
        }
    ]

    // TODO: get shelves from closetData
    // let shelves = [
    //     {
    //         name: "Default Shelf",
    //         id: 0
    //     },
    // ];
    console.log("id data");
    console.log(id);

    const handleButton = () => {
        eventBus.dispatch("cancel adding container");
    }

    let count = 0;
    return (
        <div id="itemcard">
            <h2>Add a Container</h2>
            <p>Note: All attributes must be filled upon creation.</p>
            <form id="itemform" onSubmit={addContainer}>
                {
                    items.map(({ name, slug, type }) =>
                        <div key={count++}>
                            <b>{name}: </b>
                            <input name={slug} type={type}></input>
                            <br/><br/>
                        </div>
                    )
                }
                <select id = "shelf" name = "shelf_id">
                    {
                        id.shelves.map(({ name, shelf_id }) =>
                            <option key={count++} value={shelf_id}>{name}</option>
                        )
                    }
                </select>
                <br/><br/>
                <button className="button" type="button" onClick={handleButton}>Cancel</button>
                <input className="button" type="submit" value="Add Container" />
            </form>
        </div>
    )
}

export default AddContainerCard;