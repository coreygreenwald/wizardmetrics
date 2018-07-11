import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios';

export default class Settings_UserInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            userInfoId: '',
            userSubmitId: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount(){
        const {submitId, dataLocationId} = this.props.userInfo;
        this.setState({
            userInfoId: dataLocationId,
            userSubmitId: submitId
        })
    }
    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit(e){
        e.preventDefault();
        e.stopPropagation();
        console.log('this will update when route is made!');
    }
    render(){
        return (
            <div className="settings-user-info">
                <label>Id of Input Box for Email/Username Form<input name="userInfoId" onChange={this.handleChange} value={this.state.userInfoId}/></label>
                <label>Id of Submit Button for Email/Username Form<input name="userSubmitId" onChange={this.handleChange} value={this.state.userSubmitId}/></label>
                <button onClick={this.handleSubmit} className="btn">Update User-Session Mapper</button>
            </div>
        )
    }
}