import React, { Component } from 'react'
import PropTypes from 'prop-types'

function colorChooser(occurrences, completedJourneys){
    let hex;
    let percentage = Number(occurrences) / completedJourneys;
    if(percentage < .05){
        hex = '#b62120'
    } else if(percentage < .2){
        hex = '#b53921'
    } else if(percentage < .3){
        hex = '#b65e21'
    } else if(percentage < .5){
        hex = '#b69920'
    } else if(percentage < .65){
        hex = '#9fb620';
    } else if(percentage < .75){
        hex = '#6eb620';
    } else {
        hex = '#22b654';
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
    render(){
        const {actionData, percent, occurrences, time, totalCount, completedJourneys, totalJourneys, referrers, identifiers, handleClick, index, selected} = this.props
        const styleObj = {width: '95%', height: '150px', backgroundColor: colorChooser(occurrences, completedJourneys)};
        if(selected){
            styleObj.border = '4px solid #f1ff18';
        }
        return (
            // {width: `${((Number(occurrences) / totalJourneys) * 45) + 50}%`
            <div style={styleObj} className="admin-panel-funnel-item" onClick={() => handleClick(index)}>
                <div className="admin-panel-funnel-item-event">
                    <h1>Step {index + 1}</h1>
                    {/* <h2>ACTION</h2>
                    <h4>TYPE: {actionData.type}</h4>
                    <h4>PATH: {actionData.path}</h4> */}
                    {/* <h4>INFO: {actionData.info}</h4> */}
                    <div className="admin-panel-funnel-item-event-special">
                        {
                            actionData.isConversion &&
                            (
                                <h5>Conversion	✅</h5>
                            )
                        }
                        {
                            identifiers && identifiers.length ?
                                (
                                    <h5>Stuck Customers ❌</h5>
                                ) : null
                        }
                        {
                            Object.keys(referrers) && Object.keys(referrers).length ? 
                                (
                                    <h5>Referrals Found	✅</h5>
                                ) : null
                        }
                    </div>
                </div>
                {/* <div className="admin-panel-funnel-item-number"> */}
                    <h2>{occurrences} Users</h2>
                {/* </div> */}
                <div className="admin-panel-funnel-item-data">
                    <h2>TYPE: {actionData.type}</h2>
                    <h2>Page URL: {actionData.path}</h2>
                    {/* <h2>Number of Users: {occurrences}</h2>
                    <h2>Percent of Users: {percent}%</h2> */}
                    {/* <h2>Percent Of Actions: {percent}%</h2> 
                    <h2>Total Actions Of This Type: {occurrences}</h2>
                    <h2>Total Customers At This Step: {totalCount}</h2> */}
                </div> 
            </div>
        )
    }
}
