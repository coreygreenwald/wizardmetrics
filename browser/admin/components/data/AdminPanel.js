import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const AdminPanel = (props) => {
  const {username} = props
  return (
    <div>
      <h3>DATA WILL GO HERE!</h3>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    name: state.user.username
  }
}

export default connect(mapState)(AdminPanel)

/**
 * PROP TYPES
 */
AdminPanel.propTypes = {
  name: PropTypes.string
}
