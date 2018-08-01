import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {retrieveJourneyData} from '../../store'
import {kFormatter} from '../../utils'
// import { LineChart, Line, Legend, Tooltip, CartesianGrid, XAxis, YAxis } from 'recharts'

import './UserHome.scss';
/**
 * COMPONENT
 */

class UserHome extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    if(!this.props.data.info){
      this.props.fetchJourneyData()
    }
  }

  render(){
    const data = [
      {name: 'Week 1', percent: .04, pv: 2400, amt: 2400},
      {name: 'Week 2', percent: .051, pv: 1398, amt: 2210},
      {name: 'Week 3', percent: .07, pv: 9800, amt: 2290},
      {name: 'Week 4', percent: .08, pv: 3908, amt: 2000},
      {name: 'Week 5', percent: .09, pv: 4800, amt: 2181},
      {name: 'Week 6', percent: .11, pv: 3800, amt: 2500},
      {name: 'Week 7', percent: .1357, pv: 4300, amt: 2100},
    ];
    const {name} = this.props;
    const { info, shortestJourneyLength, shortestJourneyTime, completedJourneys, totalJourneys } = this.props.data;
    return (
      <div className="main-home">
        <h3>Welcome {name}!</h3>
        <div className="main-home-banner">
          <div className="main-home-banner-metric">
            <h1>{(completedJourneys / totalJourneys * 100).toFixed(2)}%</h1>
            <h2>Your Overall Conversion Rate</h2>
          </div>
          <div className="main-home-banner-metric">
            <h1>{kFormatter(totalJourneys)}</h1>
            <h2>Total Aquisitions</h2>
          </div>
          <div className="main-home-banner-metric">
            <h1>{kFormatter(completedJourneys)}</h1>
            <h2>Total Customers</h2>
          </div>
        </div>
        <div className="main-home-chart">
        {/* <LineChart width={950} height={430} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis dataKey="percent" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="percent" stroke="#8884d8" />
        </LineChart> */}
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
    name: state.user.name,
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


export default connect(mapState, mapDispatch)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  name: PropTypes.string
}
