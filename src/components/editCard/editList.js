import React from 'react';
import './editList.css';
import eventBus from '../../EventBus/eventbus.js';

class EditItemCard extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        let shelfdata = Array.from(props);
    }

    handleBackButton = () => {
        console.log("dispatching cancel modify");
        eventBus.dispatch("cancel modify item", {message: "cancel modify item"});
    }

    
    
    render() {
        
        {console.log("shelfdata")}
        {console.log(this.shelfdata)}
        let dashboarddata = <div id="tablecontainer">
        {this.shelfdata && this.shelfdata.map((shelf) => {
            return (                
                <div>
                    <table id="dashboardtable">
                        <tbody>
                            {console.log(shelf)}
                            <tr id='containersanditems'>
                            {shelf["items"] && shelf["items"].map((item) => {
                                return (
                                    <td id='item'><button id='item' className='containeritem'>{item["name"]}</button></td>
                                );
                            })
                            }
                            {shelf["containers"] && shelf["containers"].map((container) => {
                                return (
                                    <td id='container'><button id='container' className='containeritem' onClick={() => this.handleContainer(container)}>{container["name"]}</button></td>
                                );
                            })
                            }
                            </tr>
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
            
            <div id="editcard">
                <h1>Modify Your Closet</h1>
                <table>
                    {dashboarddata}
                </table>
                <button type='button'>{'<'} Back</button>
            </div>
        )
    }
}

export default EditItemCard;