import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios';

export default class Settings_UserInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            userInfoId: '',
            userInfoType: 'ID',
            userSubmitId: '',
            userSubmitType: 'ID'
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount(){
        const {submitId, submitType, dataLocationId, dataLocationType} = this.props.userInfo;
        this.setState({
            userInfoId: dataLocationId,
            userSubmitId: submitId,
            userInfoType: dataLocationType,
            userSubmitType: submitType 
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
        const { userInfoId, userSubmitId, userInfoType, userSubmitType} = this.state; 
        axios.put('/admin/settings', {
         sessionInfoGrabber: {
            dataLocationId: userInfoId,
            submitId: userSubmitId,
            dataLocationType: userInfoType,
            submitType: userSubmitType
         }   
        }).then(() => {
            alert('This will be replaced with a toast! But everything worked :)')
        }).catch(() => console.log('error'));
    }
    render(){
        return (
            <div className="settings-user-info">
                <label>Identifier of Input Box for Email/Username Form
                    <input name="userInfoId" onChange={this.handleChange} value={this.state.userInfoId}/>
                    <select name="userInfoType" onChange={this.handleChange} value={this.state.userInfoType}>   
                        <option value="ID">ID - Identify an Input Field by Its Id</option>
                        <option value="CLASS">CLASS - Identify an Input Field by Its Class</option>
                    </select>
                </label>
                <label>Identifier of Submit Button for Email/Username Form
                    <input name="userSubmitId" onChange={this.handleChange} value={this.state.userSubmitId}/>
                    <select name="userSubmitType" onChange={this.handleChange} value={this.state.userSubmitType}>   
                        <option value="ID">ID - Identify a Submit Button by Its Id</option>
                        <option value="CLASS">CLASS - Identify a Submit Button by Its Class</option>
                    </select>
                </label>
                <button onClick={this.handleSubmit} className="btn">Update User-Session Mapper</button>
            </div>
        )
    }
}