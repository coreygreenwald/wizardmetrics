import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {Login, UserHome, AdminPanel, ConversionManager, Settings} from './components'
import {me, retrieveJourneyData} from './store'

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount () {
    this.props.loadInitialData()
    this.props.fetchJourneyData()
  }

  render () {
    const {isLoggedIn} = this.props

    return (
      <div className="main">
        <Switch>
          {/* Routes placed here are available to all visitors */}
          <Route path="/login" component={Login} />
          {
            isLoggedIn &&
              <Switch>
                {/* Routes placed here are only available after logging in */}
                <Route path="/journeys" component={AdminPanel} />
                <Route path="/conversions" component={ConversionManager} />
                <Route path="/settings" component={Settings} />
                <Route exact path="/" component={UserHome} />
              </Switch>
          }
          {/* Displays our Login component as a fallback */}
          <Route component={Login} />
        </Switch>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.username
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadInitialData () {
      dispatch(me())
    },
    fetchJourneyData(){
      dispatch(retrieveJourneyData())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
