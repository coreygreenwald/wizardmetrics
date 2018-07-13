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
    this.state = {
      activeItem: 0
    }
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
        <div className="admin-panel-stats">
          <div className="admin-panel-stats-content">
            <h1>Journey Overview</h1>
            <div className="admin-panel-stats-content-holder">
              <div className="admin-panel-stats-content-holder-child">
                <h2>Total Users in Funnel: {totalJourneys}</h2>
                <h2>Total Conversions: {completedJourneys}</h2>
                <h2>Total Email Signups: PLACEHOLDER </h2>
              </div>
              <div className="admin-panel-stats-content-holder-child">
                <h2>Average Nurturing Time / Steps PLACEHOLDER </h2>
                <h2>Shortest Journey Length (Time): {shortestJourneyTime} seconds </h2>
                <h2>Shortest Journey Length (Steps): {shortestJourneyLength} steps</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-panel-funnel">
          <div className="admin-panel-funnel-items">
            {
              info && info.length ? mostCommonJourney(info).map(({actionData, percent, occurrences, time, totalCount, referrers, identifiers }) => {
                return (
                  <FunnelItem actionData={actionData} percent={percent} occurrences={occurrences} time={time} totalCount={totalCount} completedJourneys={completedJourneys} totalJourneys={totalJourneys} referrers={referrers} identifiers={identifiers}/>
                )
              }) : 
              ( <h1> Sorry No Data Today! </h1>)
            }
          </div>
          <div className="admin-panel-funnel-stats">
            <h1> Metrics / Step 2 </h1>
            <div className="admin-panel-funnel-stats-metrics">
              <div className="admin-panel-funnel-stats-metrics-metric">
                <h2>55%</h2>
                <p>Step 2 - Visit Page</p>
              </div>
              <div className="admin-panel-funnel-stats-metrics-metric">
                <h2>1:26 Minutes</h2>
                <p>Avg Time On /home</p>
              </div>
              <div className="admin-panel-funnel-stats-metrics-metric">
                <h2>68% Bounce Rate</h2>
                <p>Avg Bounce Rate</p>
              </div>
              <div className="admin-panel-funnel-stats-metrics-metric">
                <h2>80%</h2>
                <p>Avg Scroll Length</p>
              </div>
              <div className="admin-panel-funnel-stats-metrics-metric">
                <h2>0</h2>
                <p>Conversions at Step 2</p>
              </div>
              <div className="admin-panel-funnel-stats-metrics-metric">
                <h2>2.1k</h2>
                <p># of Users at Step 2</p>
              </div>
            </div>
            <div className="admin-panel-funnel-stats-recommendations">
              <h2>Recommendations</h2>
              <p>You have 264 users stuck at this step. It is suggested to export a list of these users and send them an email to get them to /features/pricing to continue on their journey.</p>
            </div>
            <div className="admin-panel-funnel-stats-actions">
              <h2>Actions</h2>
              <div className="admin-panel-funnel-stats-actions-body">
                <button> Export Emails </button>
                <button> Do Other Things </button>
                <button> Do Some Other Stuff </button>
              </div>
            </div>
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
