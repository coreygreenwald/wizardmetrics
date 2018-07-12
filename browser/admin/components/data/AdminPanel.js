import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {retrieveJourneyData} from '../../store'
import { mostCommonJourney } from '../../utils'
import FunnelItem from './FunnelItem';
import './AdminPanel.scss';
/**
 * COMPONENT
 */
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
            info && info.length ? mostCommonJourney(info).map(({actionData, percent, occurrences, time, totalCount, referrers, identifiers }) => {
              return (
                <FunnelItem actionData={actionData} percent={percent} occurrences={occurrences} time={time} totalCount={totalCount} completedJourneys={completedJourneys} totalJourneys={totalJourneys} referrers={referrers} identifiers={identifiers}/>
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
