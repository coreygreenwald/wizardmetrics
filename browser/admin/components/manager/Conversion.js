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

        // function generateMatchHtml(matchData){
        //     let arr = [];
        //     for(let k in matchData){
        //         arr.push((<h3>{k}: {matchData[k] || 'UNMATCHED'}</h3>))
        //     }
        //     console.log(arr);
        //     return arr;
        // }
        const { conversion, position, actionData } = this.props;
        return (
            <div key={conversion.id} className="single-conversion">
                <div className="single-conversion-description">
                    <h2>Type: {conversion.type}</h2>
                    <h2>Path: {conversion.path}</h2>
                    <h2>Strength: {conversion.strength}</h2>
                    {
                        Object.keys(conversion.matchData).length ? (
                        <div className="single-conversion-match">
                            <h2>Data To Match: </h2>
                            {
                                Object.keys(conversion.matchData || {}).map(key => {
                                    return (
                                        <h3>{key}: {conversion.matchData[key] || 'UNMATCHED'}</h3>
                                    )
                                })
                            }
                        </div>
                    ) : null
                    }
                    
                    <button className="btn" onClick={() => console.log('this will remove eventually')}>REMOVE CONVERSION</button>
                </div>
                <div className="single-conversion-data">
                    {/* <h2>Number of Matches: {actionData}</h2>  */}
                </div>
            </div>
        )
    }
}

export default ConversionManager;