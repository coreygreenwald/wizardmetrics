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
        const styleObj = {width: '95%', height: '120px', backgroundColor: colorChooser(occurrences, completedJourneys)};
        if(selected){
            styleObj.border = '4px solid #f1ff18';
        }
        return (
            <div style={styleObj} className="admin-panel-funnel-item" onClick={() => handleClick(index)}>
                <div className="admin-panel-funnel-item-event">
                    <h1>Step {index + 1}</h1>
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
                <h2>{occurrences} Users</h2>
                <div className="admin-panel-funnel-item-data">
                    <div className="admin-pannel-funnel-item-image">
                        <img src={`/assets/icons/${actionData.isConversion ? 'conversion' : actionData.type}.png`}/>
                    </div>
                    <div className="admin-pannel-funnel-item-block">
                        <h2>TYPE: {actionData.type}</h2>
                        <h2>Page URL: {actionData.path}</h2>
                    </div>
                </div> 
            </div>
        )
    }
}
