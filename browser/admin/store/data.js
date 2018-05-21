import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_DATA = 'GET_DATA'

/**
 * INITIAL STATE
 */
const defaultData = [];

/**
 * ACTION CREATORS
 */
const getData = data => ({type: GET_DATA, data})

/**
 * THUNK CREATORS
 */

export const retrieveCustomerData = () => 
  dispatch =>
    axios.get('/admin/data')
      .then(res =>
        dispatch(getData(res.data)))
      .catch(err => console.log(err));

/**
 * REDUCER
 */
export default function (state = defaultData, action) {
  switch (action.type) {
    case GET_USER:
      return action.data
    default:
      return state
  }
}
