import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {retrieveJourneyData} from '../../store'
import { mostCommonJourney, mostImpactfulJourney, kFormatter } from '../../utils'
import FunnelItem from './FunnelItem';
import StatsPanel from './StatsPanel';
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
    const mostCommonInfo = journeyInfo.journey.filter((step, idx) => {
      let returnFactor = true; 
      if((step.totalActionCount / totalJourneys) < .03 || step.totalActionCount < 50) returnFactor = false;
      if(idx !== 0 && journeyInfo.journey[idx - 1].metaData.isConversion) returnFactor = false;
      return returnFactor;
    })
    // (((step.totalActionCount / totalJourneys) > .03 || step.totalActionCount > 50) && ((idx === 0 || (journeyInfo.journey[idx - 1]) && !journeyInfo.journey[idx - 1].metaData.isConversion))))
    const { totalSignups } = journeyInfo; 
    const {actionData, percent, occurrences, time, totalCount, referrers, identifiers, conversionsAtStep, allIdentifiers, metaData } = mostCommonInfo[this.state.activeItem] || {}
    // const conversionIndicator = metaData ? (metaData.futureConversionCounter.hard / occurrences).toFixed(2) : 0;
    return (
      <div className="admin-panel">
        <div className="admin-panel-selector tab">
            <button className={`tablinks ${this.state.dataModel === 'MOST_IMPACTFUL' ? 'active' : ''}`}  onClick={() => this.setState({dataModel: 'MOST_IMPACTFUL'})}>Most Impactful</button>
            <button className={`tablinks ${this.state.dataModel === 'MOST_COMMON' ? 'active' : ''}`} onClick={() => this.setState({dataModel: 'MOST_COMMON'})}>Most Common</button>
            <button className={`tablinks ${this.state.dataModel === 'MOST_HURTFUL' ? 'active' : ''}`} onClick={() => alert('This Feature is Coming Soon!')}>Most Hurtful</button>
        </div>
        {
          this.state.showUsers ? 
            (
                <div className="modal admin-panel-funnel-item-users-modal">
                    <h2>{identifiers.slice(0,10).join(', ') + '...'}</h2>
                    <div className="admin-panel-funnel-item-users-modal-buttons">
                        <button className="btn white" onClick={(e) => this.downloadCSV(e, identifiers)}> Download CSV </button>
                        <button className="btn white" onClick={() => this.setState({showUsers: false})}> Close </button>
                    </div>
                </div>
            ) : null 
        }
        {
          this.state.showReferrers ? 
          (
              <div className="modal admin-panel-funnel-item-users-modal">
                  <h2>{Object.keys(referrers).map(referrerName => <p>{referrerName + ': ' + referrers[referrerName]}</p>)}</h2>
                  <div className="admin-panel-funnel-item-users-modal-buttons">
                      <button className="btn white" onClick={(e) => this.downloadCSV(e, referrers)}> Download CSV </button>
                      <button className="btn white" onClick={() => this.setState({showReferrers: false})}> Close </button>
                  </div>
              </div>
          ) : null 
      }
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
              <StatsPanel currItem={mostCommonInfo[this.state.activeItem] || {}} nextItem={mostCommonInfo[this.state.activeItem + 1] || {}} activeItemNum={this.state.activeItem} showUsersFunc={() => this.setState({showUsers: true})} showReferrersFunc={() => this.setState({showReferrers: true})}/>
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
