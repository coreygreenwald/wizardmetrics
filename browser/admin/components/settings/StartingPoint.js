import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios';

export default class Settings_StartingPoint extends Component {
    constructor(props){
        super(props);
        this.state = {
           startingPoint: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount(){
        this.setState({
            startingPoint: this.props.startingPoint
        })
    }
    handleChange(e){
        this.setState({
            startingPoint: e.target.value
        })
    }
    handleSubmit(e){
        e.preventDefault();
        e.stopPropagation();
        axios.put('/admin/settings', {
         startingPoint: this.state.startingPoint
        }).then(() => {
            alert('This will be replaced with a toast! But everything worked :)')
        }).catch(() => console.log('error'));
    }
    render(){
        return (
            <div className="settings-user-info">
                <label>Enable tracking only at a starting point. Leave empty for anywhere.
                    <input name="startingPoint" onChange={this.handleChange} value={this.state.startingPoint}/>
                </label>
                <button onClick={this.handleSubmit} className="btn">Update Session Starting Point</button>
            </div>
        )
    }
}