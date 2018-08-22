import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import UserInfo from './UserInfo';
import Integrations from './Integrations';
import './Settings.scss';

class Settings extends Component {
    constructor(props){
        super(props);
    }
    
    render(){
        return(
            <div className="settings">
                <UserInfo userInfo={this.props.userInfo}/>
                <Integrations />
            </div>
        )
    }
}

const mapState = (state) => {
    return {
      userInfo: state.user.sessionInfoGrabber
    }
  }

export default connect(mapState)(Settings); 