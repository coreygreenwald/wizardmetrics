import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import axios from 'axios';
/**
 * COMPONENT
 */
class ConversionManager extends Component {
    constructor(props){
        super(props);
        this.state = {
            addFormVisible: false,
            action: 'ARRIVAL',
            path: '/',
            matchData: {

            }
        }
        this.handleChange = this.handleChange.bind(this); 
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e){
        console.log('fired', e.target.value)
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit(e){
        e.preventDefault();
        e.stopPropagation();
        axios.post('/admin/data/conversions',{
            username: this.props.username,
            conversion: {
                type: this.state.action,
                path: this.state.path,
                matchData: this.state.matchData
            }
        })
            .then(res => res.data)
            .catch(() => console.log('there was an error'));
    }
    render(){
        const {conversions} = this.props
        return (
          <div className="conversion-manager">
              <div className="conversion-manager-existing">
                  <table className="conversion-manager-existing-table">
                      <tr className="conversion-manager-existing-table-header">
                          <th>Number</th>
                          <th>Type</th>
                          <th>Path</th>
                          <th>Data To Match</th>
                      </tr>
                      {
                          conversions.map((conversion, idx) => {
                              return (
                                  <tr key={conversion.id} className="conversion-manager-existing-table-row">
                                      <th>{idx + 1}</th>
                                      <th>{conversion.type}</th>
                                      <th>{conversion.path}</th>
                                      <th>{JSON.stringify(conversion.matchData)}</th>
                                      <button onClick={() => console.log('this will remove eventually')}>REMOVE CONVERSION</button>
                                  </tr>
                              )
                          })
                      }
                  </table> 
              </div>
              <div className="conversion-manager-add">
                {
                    this.state.addFormVisible ? 
                    (
                        <div className="conversion-manager-add-form">
                            <br />
                            <div className="conversion-manager-add-form-action">
                                <label> Select the action a user must do to trigger a conversion:
                                    <select name="action" value={this.state.action} onChange={this.handleChange}>
                                        <option value="ARRIVAL">ARRIVAL - Flag Arrivals To A Particular Page</option>
                                        <option value="CLICK">CLICK - Flag Clicks On A Particular Page </option>
                                        <option value="INPUT">INPUT - Watch For Input to a Particular HTML Element</option>
                                        <option value="OTHER">OTHER - Make Your Conversion ACTION agnostic</option>
                                    </select>
                                </label>
                            </div>
                            <div className="conversion-manager-add-form-path">
                                <label> Enter Your Relative Website Path (ex. /order/confirmation). Delineate any variable parts of the path by preceeding with a ':' (ex. /orders/:id/confirm):
                                    <input name="path" onChange={this.handleChange} type="text" name="path" value={this.state.path} onChange={this.handleChange} />
                                </label>
                            </div>
                            <div className="conversion-manager-add-form-additional-info">
                                <label> Select Any Optional Info You'd Like to Match Actions On
                                    
                                </label>
                            </div>
                            <button type="submit" onClick={this.handleSubmit}>Submit Form</button>
                        </div>
                    ) : 
                    <button onClick={() => this.setState({addFormVisible: true})}>Add A Conversion!</button> 
                }  
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
    username: state.user.username,
    conversions: state.user.conversions || []
  }
}

export default connect(mapState)(ConversionManager)

/**
 * PROP TYPES
 */
ConversionManager.propTypes = {
  name: PropTypes.string,
  conversions: PropTypes.any
}
