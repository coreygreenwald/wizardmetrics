import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_CUSTOMER_DATA = 'GET_CUSTOMER_DATA'
const GET_JOURNEY_DATA = 'GET_JOURNEY_DATA'
const GET_MODEL_IMPACT_DATA = 'GET_MODEL_IMPACT_DATA'
const GET_MODEL_COMMON_DATA = 'GET_MODEL_COMMON_DATA'
/**
 * INITIAL STATE
 */
const defaultData = {
  customer: {},
  journeyMeta: {},
  impact: {},
  common: {}
};

/**
 * ACTION CREATORS
 */
const getCustomerData = customerData => ({type: GET_CUSTOMER_DATA, customerData})
const getJourneyData = journeyMeta => ({type: GET_JOURNEY_DATA, journeyMeta})
const getModelImpactData = impact => ({type: GET_MODEL_IMPACT_DATA, impact})
const getModelCommonData = common => ({type: GET_MODEL_COMMON_DATA, common})
// const getJourneyData = getJourneyData => ({type: GET_CUSTOMER_DATA, customerData})

/**
 * THUNK CREATORS
 */

export const retrieveCustomerData = () => 
  dispatch =>
    axios.get('/admin/data')
      .then(res =>
        dispatch(getCustomerData(res.data)))
      .catch(err => console.log(err));

export const retrieveJourneyData = () => 
  dispatch =>
    axios.get('/admin/data/journeys')
      .then(res =>
        dispatch(getJourneyData(res.data)))
      .catch(err => console.log(err));

export const retrieveImpactModelData = () => 
  dispatch =>
    axios.get('/admin/data/journeys?model=IMPACT')
      .then(res =>
        dispatch(getModelImpactData(res.data)))
      .catch(err => console.log(err));

export const retrieveCommonModelData = () => 
  dispatch =>
    axios.get('/admin/data/journeys?model=COMMON')
      .then(res =>
        dispatch(getModelCommonData(res.data)))
      .catch(err => console.log(err));
/**
 * REDUCER
 */
export default function (state = defaultData, action) {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case GET_CUSTOMER_DATA:
      newState.customer = action.customerData
      return newState
    case GET_JOURNEY_DATA:
      newState.journeyMeta = action.journeyMeta
      return newState
    case GET_MODEL_IMPACT_DATA:
      newState.impact = action.impact
      return newState
    case GET_MODEL_COMMON_DATA:
      newState.common = action.common
      return newState
    default:
      return state
  }
}
