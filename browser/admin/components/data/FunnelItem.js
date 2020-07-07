import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { kFormatter } from '../../utils'

function colorChooser(conversionIndicator, conversionRate, occurrences, totalJourneys, totalConversionIndex){
    let hex;
    let percentage = conversionIndicator / conversionRate;
    let occurrenceThres = occurrences / totalJourneys < .1;
    if(totalConversionIndex > .5){
        return '#22b654';
    } else if(totalConversionIndex > .3){
        return '#9fb620';
    } else {
        if(percentage < .3 && occurrenceThres){
            hex = '#b62130'
        } else if(percentage < .5 && occurrenceThres){
            hex = '#b53921'
        } else if(percentage < .8){
            hex = '#b65e21'
        } else if((percentage >= .8 && percentage < 1.2) || !occurrenceThres){
            hex = '#b69920'
        } else if(percentage < 1.5){
            hex = '#9fb620';
        } else {
            hex = '#22b654';
        }
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
        const {metaData, conversionRate, actionData, percent, occurrences, time, totalCount, completedJourneys, totalJourneys, referrers, identifiers, handleClick, index, selected} = this.props
        const conversionIndicator = metaData ? (metaData.futureConversionCounter.hard / occurrences * 100) : 0;
        const totalConversionIndex = metaData ? metaData.futureConversionCounter.hard / completedJourneys : 1; 
        const styleObj = {width: '95%', height: '120px', backgroundColor: colorChooser(conversionIndicator, conversionRate, occurrences, totalJourneys, totalConversionIndex)};
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
                <h2>{kFormatter(occurrences)} Users</h2>
                <div className="admin-panel-funnel-item-data">
                    <div className="admin-panel-funnel-item-image">
                        <img src={`/assets/icons/${actionData.isConversion ? 'conversion' : actionData.type.toLowerCase()}.png`}/>
                    </div>
                    <div className="admin-panel-funnel-item-block">
                        <h2>TYPE: {actionData.type}</h2>
                        <h2>Page URL: {actionData.path}</h2>
                    </div>
                </div> 
            </div>
        )
    }
}
