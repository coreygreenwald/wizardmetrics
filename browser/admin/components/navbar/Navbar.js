import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../../store'

const Navbar = ({ handleClick, isLoggedIn }) => (
  <div className="navbar">
    <h1 className="navbar-title">WizardMetrics</h1>
    <nav className="navbar-links">
      {isLoggedIn ? (
        <div className="navbar-links-container">
          {/* The navbar will show these links after you log in */}
          <Link to="/">Home</Link>
          <Link to="/journeys">Journeys</Link>
          <Link to="/conversions">Conversions</Link>
          <Link to="/settings">Settings</Link>
          <a href="#" onClick={handleClick}>
            Logout
          </a>
        </div>
      ) : (
        <div className="navbar-links-container">
          {/* The navbar will show these links before you log in */}
          <Link to="/login">Login</Link>
        </div>
      )}
    </nav>
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.name
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
