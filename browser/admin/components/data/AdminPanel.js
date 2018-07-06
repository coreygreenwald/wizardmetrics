import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {retrieveJourneyData} from '../../store'
import { mostCommonJourney } from '../../utils'
import './AdminPanel.scss';
/**
 * COMPONENT
 */
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
class AdminPanel extends Component {
  constructor(props){
    super(props); 
  }
  componentDidMount(){
    if(!this.props.data.info){
      this.props.fetchJourneyData()
    }
  }
  render(){
    const { info, shortestJourneyLength, shortestJourneyTime, completedJourneys, totalJourneys } = this.props.data;
    return (
      <div className="admin-panel">
        <div className="admin-panel-funnel">
          {
            info && info.length ? mostCommonJourney(info).map(({actionData, percent, occurrences, time, totalCount }) => {
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
                </div>
              )
            }) : 
            ( <h1> Sorry No Data Today! </h1>)
          }
        </div>
        <div className="admin-panel-stats">
          <div className="admin-panel-stats-content">
            <h1>Journey Metrics</h1>
            <h2>Acquisitions: {totalJourneys}</h2>
            <h2>Conversions: {completedJourneys}</h2>
            <h2>Shortest Journey Length (Time): {shortestJourneyTime} seconds </h2>
            <h2>Shortest Journey Length (Steps): {shortestJourneyLength} steps</h2>
          </div>
        </div>
      </div>
    )
  }
}
/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    name: state.user.username,
    data: state.data
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchJourneyData(){
      dispatch(retrieveJourneyData())
    }
  }
}

export default connect(mapState, mapDispatch)(AdminPanel)

/**
 * PROP TYPES
 */
AdminPanel.propTypes = {
  name: PropTypes.string
}
