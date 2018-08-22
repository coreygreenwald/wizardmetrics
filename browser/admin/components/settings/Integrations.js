import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios';

export default class Settings_Integrations extends Component {
    constructor(props){
        super(props);
        this.state = {
            zapierKey: ''
        }
        this.handleKeyRetrieval = this.handleKeyRetrieval.bind(this);
    }

    handleKeyRetrieval(appName){
        axios.get(`/admin/integrations/${appName}/key`)
            .then(res => res.data)
            .then(apiKey => {
                this.setState({
                    zapierKey: apiKey
                })
            })
            .catch(err => console.log(err));
    }

    render(){
        return (
            <div className="settings-user-info">
                <h2>Manage Your Integrations (Beta)</h2>
                {
                    this.state.zapierKey ? (
                        <div>
                            <h2>Your Api Key: {this.state.zapierKey}</h2>
                            <p>Please keep this key private and ONLY provide it to Zapier</p>
                        </div>
                    ) : (
                        <div>
                            <button onClick={() => this.handleKeyRetrieval('Zapier')} className="btn">Zapier - Create/Show Api Key</button>
                        </div>
                    )
                }
            </div>
        )
    }
}