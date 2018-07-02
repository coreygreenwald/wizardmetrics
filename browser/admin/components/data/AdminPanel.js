import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {retrieveJourneyData} from '../../store'

/**
 * COMPONENT
 */
class AdminPanel extends Component {
  constructor(props){
    super(props); 
  }
  componentDidMount(){
    this.props.fetchJourneyData()
  }
  render(){
    return (
      <div>
        <h3>DATA WILL GO HERE!</h3>
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
