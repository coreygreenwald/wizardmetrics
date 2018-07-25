import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {retrieveJourneyData} from '../../store'
import { mostCommonJourney, mostImpactfulJourney } from '../../utils'
import FunnelItem from './FunnelItem';
import './AdminPanel.scss';
/**
 * COMPONENT
 */
class AdminPanel extends Component {
  constructor(props){
    super(props); 
    this.state = {
      activeItem: -1,
      dataModel: 'MOST_IMPACTFUL',
      showUsers: false,
      showReferrers: false
    }
    this.handleClick = this.handleClick.bind(this); 
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
  componentDidMount(){
    if(!this.props.data.info){
      this.props.fetchJourneyData()
    }
  }
  handleClick(itemNumber){
    if(this.state.activeItem === itemNumber){
      this.setState({
        activeItem: -1
      })
    } else {
      this.setState({
        activeItem: itemNumber
      })
    }
  }
  handleModelSelection(){

  }
  render(){
    const { info, shortestJourneyLength, shortestJourneyTime, completedJourneys, totalJourneys } = this.props.data;
    let journeyInfo = {journey: []};
    if(info && info.length){
      if(this.state.dataModel === 'MOST_COMMON'){
        journeyInfo = mostCommonJourney(info); 
      } else {
        journeyInfo = mostImpactfulJourney(info, 'BOTH')
      }
    }
    // const journeyInfo = (info && info.length) ? mostCommonJourney(info) : {journey: []};
    const mostCommonInfo = journeyInfo.journey.filter((step, idx) => (((step.totalActionCount / totalJourneys) > .03 || step.totalActionCount > 50) && (idx === 0 || (journeyInfo.journey[idx - 1] && !journeyInfo.journey[idx - 1].metaData.isConversion))))
    const { totalSignups } = journeyInfo; 
    const {actionData, percent, occurrences, time, totalCount, referrers, identifiers, conversionsAtStep, allIdentifiers, metaData } = mostCommonInfo[this.state.activeItem] || {}
    const conversionIndicator = metaData ? (metaData.futureConversionCounter.hard / occurrences).toFixed(2) : 0;
    return (
      <div className="admin-panel">
        <div className="admin-panel-selector tab">
            <button className={`tablinks ${this.state.dataModel === 'MOST_IMPACTFUL' ? 'active' : ''}`}  onClick={() => this.setState({dataModel: 'MOST_IMPACTFUL'})}>Most Impactful</button>
            <button className={`tablinks ${this.state.dataModel === 'MOST_COMMON' ? 'active' : ''}`} onClick={() => this.setState({dataModel: 'MOST_COMMON'})}>Most Common</button>
        </div>
        <div className="admin-panel-funnel">
          <div className={`${this.state.activeItem !== -1 ? 'admin-panel-funnel-items-collapse' : 'admin-panel-funnel-items'}`}>
            {
              mostCommonInfo.length ? mostCommonInfo.map(({actionData, percent, occurrences, time, totalCount, referrers, identifiers, allIdentifiers }, idx) => {
                return (
                  <FunnelItem actionData={actionData} percent={percent} occurrences={occurrences} time={time} totalCount={totalCount} completedJourneys={completedJourneys} totalJourneys={totalJourneys} referrers={referrers} identifiers={identifiers} index={idx} handleClick={this.handleClick} selected={this.state.activeItem === idx}/>
                )
              }) : 
              ( <h1> Sorry No Data Today! </h1>)
            }
          </div>
          {
            mostCommonInfo.length && this.state.activeItem >= 0 && (
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
                  <h2>{mostCommonInfo[this.state.activeItem + 1] ? Math.floor((occurrences - mostCommonInfo[this.state.activeItem + 1].occurrences) / occurrences * 100) : 'N/A'}%</h2>
                  <p>Avg Bounce Rate</p>
                </div>
              </div>
              <div className="admin-panel-funnel-stats-metrics-block">
                <div className="admin-panel-funnel-stats-metrics-metric">
                  <h2>{conversionIndicator}</h2>
                  <p>Conversion Indicator Index</p>
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
            {
              mostCommonInfo[this.state.activeItem + 1] ? 
              (
                <div className="admin-panel-funnel-stats-recommendations">
                  <h2>Recommendations</h2>
                  <p>You have {mostCommonInfo[this.state.activeItem].identifiers.length} users stuck on this action. It is suggested to export a list of these users and send them an email to get them to {mostCommonInfo[this.state.activeItem + 1].actionData.path} as the suggested next step on their journey.</p>
                </div>
              ) : null
            }
            <div className="admin-panel-funnel-stats-actions">
              <h2>Actions</h2>
              <div className="admin-panel-funnel-stats-actions-body">
              {
                    identifiers && identifiers.length ?
                    (
                        <div className="admin-panel-funnel-item-users">
                            <button className="btn" onClick={() => this.setState({showUsers: true})}>See Customers</button>
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
                {
                    referrers && Object.keys(referrers).length ?
                    (
                        <div className="admin-panel-funnel-item-referrals">
                            <button className="btn" onClick={() => this.setState({showReferrers: true})}>See Referrals</button>
                            {
                                this.state.showReferrers ? 
                                (
                                    <div className="modal admin-panel-funnel-item-users-modal">
                                        <h2>{Object.keys(referrers).join(', ')}</h2>
                                        <div className="admin-panel-funnel-item-users-modal-buttons">
                                            <button className="btn white" onClick={(e) => this.downloadCSV(e, referrers)}> Download CSV </button>
                                            <button className="btn white" onClick={() => this.setState({showReferrers: false})}> Close </button>
                                        </div>
                                    </div>
                                ) : null 
                            }
                        </div>
                    ) : null
                }
                {
                  ((identifiers && identifiers.length) || (referrers && Object.keys(referrers).length)) ? null : (
                    <h2> No actions to take at this step </h2>
                  )
                }
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
