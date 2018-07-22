import axios from 'axios'
import history from '../history'

// /**
//  * ACTION TYPES
//  */
const GET_CONVERSIONS = 'GET_CONVERSIONS'
const ADD_CONVERSION = 'ADD_CONVERSION'
const REMOVE_CONVERSION = 'DELETE_CONVERSION'
// /**
//  * INITIAL STATE
//  */
const defaultData = [];

// /**
//  * ACTION CREATORS
//  */
const getConversions = conversions => ({type: GET_CONVERSIONS, conversions})
const addConversion = conversion => ({type: ADD_CONVERSION, conversion})
const removeConversion = conversionId => ({type: REMOVE_CONVERSION, conversionId})
// /**
//  * THUNK CREATORS
//  */

export const retrieveConversions = () => dispatch => axios.get('/admin/data/conversions')
    .then(res => dispatch(getConversions(res.data)))
    .catch(err => console.log(err));

export const createConversion = (conversionToCreate) => dispatch => axios.post('/admin/data/conversions', conversionToCreate)
    .then(conversion => dispatch(addConversion(conversion.data)))
    .catch(err => console.log(err));

export const deleteConversion = (conversionId) => dispatch => axios.delete(`/admin/data/conversions/${conversionId}`)
    .then(res => dispatch(removeConversion(conversionId)))
    .catch(err => console.log(err));

export default function (state = defaultData, action) {
  switch (action.type) {
    case GET_CONVERSIONS:
        return action.conversions
    case ADD_CONVERSION:
        return [...state, action.conversion]
    case REMOVE_CONVERSION:
        return state.filter(conversion => conversion.id !== action.conversionId)
    default:
        return state
  }
}
