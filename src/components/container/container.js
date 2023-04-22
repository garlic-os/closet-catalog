import React from 'react';

class Container extends React.Component {

    /*
        Props:
            name
            capacity
            image
    */
    render() {
        return <h1>Container: {this.props.name}</h1>;
    }

}

export default Container;