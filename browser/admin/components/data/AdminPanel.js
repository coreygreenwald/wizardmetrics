import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {retrieveJourneyData} from '../../store'
import { mostCommonJourney } from '../../utils'
import './AdminPanel.scss';
/**
 * COMPONENT
 */
class AdminPanel extends Component {
  constructor(props){
    super(props); 
  }
  // componentDidMount(){
  //   this.props.fetchJourneyData()
  // }
  render(){
    const { info } = this.props.data;
    return (
      <div className="admin-panel">
        <div className="admin-panel-funnel">
          {
            info && info.length ? mostCommonJourney(info).map(({actionData, percent, occurrences }) => {
              return (
                <div className="admin-panel-funnel-item">
                  <div className="admin-panel-funnel-item-event">
                    <h4>TYPE: {actionData.type}</h4>
                    <h4>PATH: {actionData.path}</h4>
                    {/* <h4>INFO: {actionData.info}</h4> */}
                    {
                      actionData.isConversion &&
                      (
                        <h4>CONVERSION FLAGGED</h4>
                      )
                    }
                  </div> 
                  <div className="admin-panel-funnel-item-data">
                    <h2>PERCENT OF ACTIONS: {percent}%</h2> 
                    <h2>TOTAL OCCURRENCES: {occurrences}</h2>
                  </div> 
                </div>
              )
            }) : 
            ( <h1> Sorry No Data Today! </h1>)
          }
        </div>
        <div className="admin-panel-stats">
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

// const mapDispatch = (dispatch) => {
//   return {
//     fetchJourneyData(){
//       dispatch(retrieveJourneyData())
//     }
//   }
// }

export default connect(mapState)(AdminPanel)

/**
 * PROP TYPES
 */
AdminPanel.propTypes = {
  name: PropTypes.string
}
