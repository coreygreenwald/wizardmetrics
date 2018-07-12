import React, { Component } from 'react'
import PropTypes from 'prop-types'

function colorChooser(occurrences, completedJourneys){
    let hex;
    let percentage = Number(occurrences) / completedJourneys;
    if(percentage < .05){
        hex = '#FF1111'
    } else if(percentage < .2){
        hex = '#FF5555'
    } else if(percentage < .3){
        hex = '#FF9944'
    } else if(percentage < .5){
        hex = '#fcff89'
    } else if(percentage < .75){
        hex = '#AAFF24';
    } else {
        hex = '#77d47f';
    }
    return hex;
}

export default class FunnelItem extends Component {
    constructor(props){
      super(props);
      this.state = {
          showUsers: false
      } 
    }
    downloadCSV(event, identifiers){
        event.preventDefault();
        let csvContent = "data:text/csv;charset=utf-8,";
        identifiers.forEach((row) => {
           csvContent += row + "\r\n";
        });
        let encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
    }
    render(){
        const {actionData, percent, occurrences, time, totalCount, completedJourneys, totalJourneys, referrers, identifiers} = this.props
        return (
            <div style={{width: `${((Number(occurrences) / totalJourneys) * 45) + 50}%`, height: '150px', backgroundColor: colorChooser(occurrences, completedJourneys)}} className="admin-panel-funnel-item">
                <div className="admin-panel-funnel-item-event">
                    <h2>ACTION</h2>
                    <h4>TYPE: {actionData.type}</h4>
                    <h4>PATH: {actionData.path}</h4>
                    {/* <h4>INFO: {actionData.info}</h4> */}
                    {
                        actionData.isConversion &&
                        (
                        <h4>CONVERSION 	✅</h4>
                        )
                    }
                </div> 
                <div className="admin-panel-funnel-item-data">
                    <h2>Average Time Spent on This Action: {time} seconds</h2>
                    <h2>Percent Of Actions: {percent}%</h2> 
                    <h2>Total Actions Of This Type: {occurrences}</h2>
                    <h2>Total Customers At This Step: {totalCount}</h2>
                </div> 
                {
                    identifiers && identifiers.length ?
                    (
                        <div className="admin-panel-funnel-item-users">
                            <button onClick={() => this.setState({showUsers: true})}>See Customers</button>
                            {
                                this.state.showUsers ? 
                                (
                                    <div className="modal admin-panel-funnel-item-users-modal">
                                        <h2>{identifiers.join(', ')}</h2>
                                        <div className="admin-panel-funnel-item-users-modal-buttons">
                                            <button className="btn white" onClick={(e) => this.downloadCSV(e, identifiers)}> Download CSV </button>
                                            <button className="btn white" onClick={() => this.setState({showUsers: false})}> Close </button>
                                        </div>
                                    </div>
                                ) : null 
                            }
                        </div>
                    ) : null
                }
            </div>
        )
    }
}
