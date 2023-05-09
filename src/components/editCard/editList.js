import React from 'react';
import eventBus from '../../EventBus/eventbus.js';

class editList extends React.Component {
    constructor(props) {
        super(props);
        let count = 0;
        this.props = props;
        this.state = {
            
        };
    }
    
    render() {
        return (
            <div>
                <b>Select a entity</b>
                <select>
                    {
                        this.props.closetData.shelves.map(({ name, shelf_id}) => 
                        <option key = {this.count++} value = {shelf_id}>{name}</option>)
                    }
                </select>
            </div>
        )
    }
}

export default editList