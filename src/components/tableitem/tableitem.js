import React from 'react';
import './tableitem.css';
import eventBus from '../../EventBus/eventbus';

class TableItem extends React.Component {

    constructor(props) {
        super(props)
        this.handleClickingOnItem()
    }

    handleClickingOnItem(name) {
        eventBus.dispatch("display item", {message: "display item"});
    }

    render () {
        return (
            <div id="tableitem" onClick={() => this.handleClickingOnItem(this.props.title)}>
                <p>{this.props.title}</p>
            </div>
        )
    }
}

export default TableItem;