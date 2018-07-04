import React, { Component } from 'react'
import axios from 'axios';

/**
 * COMPONENT
 */
class ConversionManager extends Component {
    constructor(props){
        super(props);
    }

    render(){
        const { conversion, position, actionData } = this.props;
        console.log(actionData)
        return (
            <div key={conversion.id} className="single-conversion">
                <div className="single-conversion-description">
                    <h2>Number: {position}</h2>
                    <h2>Type: {conversion.type}</h2>
                    <h2>Path: {conversion.path}</h2>
                    <h2>Data To Match: {JSON.stringify(conversion.matchData)}</h2>
                    <button onClick={() => console.log('this will remove eventually')}>REMOVE CONVERSION</button>
                </div>
                <div className="single-conversion-data">
                    {/* <h2>Number of Matches: {actionData}</h2>  */}
                </div>
            </div>
        )
    }
}

export default ConversionManager;