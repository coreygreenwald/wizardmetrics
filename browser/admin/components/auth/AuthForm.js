import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../../store'
import './AuthForm.scss';

const AuthForm = (props) => {
  const {name, displayName, handleSubmit, error} = props

  return (
    <div className="auth">
      <form onSubmit={handleSubmit} name={name}>
        <div>
          <label htmlFor="customer">Username</label>
          <input name="customer" type="text" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input name="password" type="password" />
        </div>
        <div>
          <button className="btn" type="submit">{displayName}</button>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
      </form>
    </div>
  )
}

const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSubmit (evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const customer = evt.target.customer.value
      const password = evt.target.password.value
      dispatch(auth(customer, password, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)

AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
