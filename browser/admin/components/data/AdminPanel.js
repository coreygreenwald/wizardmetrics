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
    this.handleClick = this.handleClick.bind(this); 
  }
  componentDidMount(){
    if(!this.props.data.info){
      this.props.fetchJourneyData()
    }
  }
  handleClick(itemNumber){
    // console.log(itemNumber);
    this.setState({
      activeItem: itemNumber
    })
  }
  render(){
    const { info, shortestJourneyLength, shortestJourneyTime, completedJourneys, totalJourneys } = this.props.data;
    const mostCommonInfo = (info && info.length) ? mostCommonJourney(info).filter(step => (step.totalActionCount / totalJourneys) > .1) : [];
    const {actionData, percent, occurrences, time, totalCount, referrers, identifiers, conversionsAtStep, totalSignups } = mostCommonInfo[this.state.activeItem] || {}
    return (
      <div className="admin-panel">
        <div className="admin-panel-stats">
          <div className="admin-panel-stats-content">
            <h1>Journey Overview</h1>
            <div className="admin-panel-stats-content-holder">
              <div className="admin-panel-stats-content-holder-child">
                <h2>Total Users in Funnel: {totalJourneys}</h2>
                <h2>Total Conversions: {completedJourneys}</h2>
                <h2>Total Email Signups: {totalSignups} </h2>
              </div>
              <div className="admin-panel-stats-content-holder-child">
                <h2>Average Steps To Nurture: {mostCommonInfo.length}</h2>
                <h2>Average Journey Length (Time): {(mostCommonInfo.reduce((total, next) => total + Number(next.time), 0)).toFixed(1)} seconds </h2>
                {/* <h2>Shortest Journey Length (Steps): {shortestJourneyLength} steps</h2> */}
              </div>
            </div>
          </div>
        </div>
        <div className="admin-panel-funnel">
          <div className="admin-panel-funnel-items">
            {
              mostCommonInfo.length ? mostCommonInfo.map(({actionData, percent, occurrences, time, totalCount, referrers, identifiers }, idx) => {
                return (
                  <FunnelItem actionData={actionData} percent={percent} occurrences={occurrences} time={time} totalCount={totalCount} completedJourneys={completedJourneys} totalJourneys={totalJourneys} referrers={referrers} identifiers={identifiers} index={idx} handleClick={this.handleClick} selected={this.state.activeItem === idx}/>
                )
              }) : 
              ( <h1> Sorry No Data Today! </h1>)
            }
          </div>
          {
            mostCommonInfo.length && (
            <div className="admin-panel-funnel-stats">
            <h1> Metrics / Step {this.state.activeItem + 1} </h1>
            <div className="admin-panel-funnel-stats-metrics">
              <div className="admin-panel-funnel-stats-metrics-block">
                <div className="admin-panel-funnel-stats-metrics-metric">
                  <h2>{percent}%</h2>
                  <p>Step {this.state.activeItem + 1} - Visit Page</p>
                </div>
                <div className="admin-panel-funnel-stats-metrics-metric">
                  <h2>{time} Seconds</h2>
                  <p>Avg Time On {actionData.path}</p>
                </div>
                <div className="admin-panel-funnel-stats-metrics-metric">
                {/* We may want to use totalCount here */}
                  <h2>{mostCommonInfo[this.state.activeItem + 1] ? Math.floor((occurrences - mostCommonInfo[this.state.activeItem + 1].occurrences) / occurrences * 100) : 'N/A'}% Bounce Rate</h2>
                  <p>Avg Bounce Rate</p>
                </div>
              </div>
              <div className="admin-panel-funnel-stats-metrics-block">
                <div className="admin-panel-funnel-stats-metrics-metric">
                  <h2>80%</h2>
                  <p>Avg Scroll Length</p>
                </div>
                <div className="admin-panel-funnel-stats-metrics-metric">
                  <h2>{conversionsAtStep}</h2>
                  <p>Conversions at Step {this.state.activeItem + 1}</p>
                </div>
                <div className="admin-panel-funnel-stats-metrics-metric">
                  <h2>{totalCount}</h2>
                  <p># of Users at Step {this.state.activeItem + 1}</p>
                </div>
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
            )
          }
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
