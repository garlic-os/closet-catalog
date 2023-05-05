import React from 'react';
import "./containerview.css";
import TableItem from '../../components/tableitem/tableitem';

class Container extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="container">
                <h1>Container: </h1>

                <table>
                    <tdata>
                        <tr>
                            <td><TableItem title="Banana"/></td>
                            <td>Orange</td>
                            <td>Apple</td>
                        </tr>
                        <tr>
                            <td>Banana</td>
                            <td>Orange</td>
                            <td>Apple</td>
                        </tr>
                        <tr>
                            <td>Banana</td>
                            <td>Orange</td>
                            <td>Apple</td>
                        </tr>
                        <tr>
                            <td>Banana</td>
                            <td>Orange</td>
                            <td>Apple</td>
                        </tr>
                        <tr>
                            <td>Banana</td>
                            <td>Orange</td>
                            <td>Apple</td>
                        </tr>
                    </tdata>
                </table>
            </div>
        )
    }
}

export default Container