import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import UserInfo from './UserInfo';
import Integrations from './Integrations';
import StartingPoint from './StartingPoint';
import './Settings.scss';

class Settings extends Component {
    constructor(props){
        super(props);
    }
    
    render(){
        return(
            <div className="settings">
                <UserInfo userInfo={this.props.userInfo}/>
                <Integrations/>
                <StartingPoint startingPoint={this.props.startingPoint}/>
            </div>
        )
    }
}

const mapState = (state) => {
    return {
      userInfo: state.user.sessionInfoGrabber,
      startingPoint: state.user.startingPoint
    }
  }

export default connect(mapState)(Settings); 