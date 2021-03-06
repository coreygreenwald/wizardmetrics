import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import axios from 'axios';
import Conversion from './Conversion';
import { retrieveConversions, createConversion, deleteConversion } from '../../store';
import './ConversionManager.scss'
/**
 * COMPONENT
 */
class ConversionManager extends Component {
    constructor(props){
        super(props);
        this.state = {
            addFormVisible: false,
            conversions: [],
            strength: 'SOFT',
            action: 'ARRIVAL',
            path: '/',
            matchData: {
                value: '',
                id: '',
                name: '',
                tagName: '',
                className: ''
            }
        }
        this.handleChange = this.handleChange.bind(this); 
        this.handleIdentifiers = this.handleIdentifiers.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount(){
        if(!this.props.conversions.length){
            this.props.loadConversions();
        }
        // Promise.all(this.props.conversions.map(conversion => {
        //     return axios.get(`/admin/data/conversions/${conversion.id}`)
        // })).then(conversions => {
        //     this.setState({conversions})
        // }).catch(err => console.log(err));
    }
    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleIdentifiers(e){
        const matchData = Object.assign({}, this.state.matchData);
        matchData[e.target.name] = e.target.value; 
        this.setState({
            matchData
        })
    }
    handleSubmit(e){
        e.preventDefault();
        e.stopPropagation();
        const newConversion = {
            type: this.state.action,
            path: this.state.path,
            strength: this.state.strength,
            matchData: (this.state.action !== 'ARRIVAL' && this.state.action !== 'NAVIGATE') ? this.state.matchData : {}
        }
        this.props.addConversion(newConversion);
        this.setState({
            addFormVisible: false
        })
    }
    render(){
        const {conversions} = this.props
        return (
          <div className="conversion-manager">
              <div className="conversion-manager-existing">
                  <div className="conversion-manager-existing-table">
                      {
                          conversions.map((conversion, idx) => <Conversion conversion={conversion} position={idx + 1} removeConversionHandler={() => this.props.removeConversion(conversion.id)} actionData={this.state.conversions[idx]}/>)
                      }
                  </div> 
              </div>
              <div className="conversion-manager-add">
                {
                    this.state.addFormVisible ? 
                    (
                        <div className="conversion-manager-add-form modal">
                            <button className="btn white conversion-manager-add-form-close" onClick={() => this.setState({addFormVisible: false})}>X</button>
                            <div className="conversion-manager-add-form-strength">
                                <label> STRENGTH - Will this conversion end a journey?
                                    <select name="strength" value={this.state.strength} onChange={this.handleChange}>
                                        <option value="HARD">HARD - This Conversion Signifies the End of a Customer Journey.</option>
                                        <option value="SOFT">SOFT -This Conversion Marks a Significant Action But Not The End of the Customer Journey</option>
                                    </select>
                                </label>
                            </div>
                            <div className="conversion-manager-add-form-path">
                            {/* Delineate any variable parts of the path by preceeding with a ':' (ex. /orders/:id/confirm): */}
                                <label>PATH - Enter a relative URI (ex. /order/confirmation):
                                    <input name="path" onChange={this.handleChange} type="text" name="path" value={this.state.path} onChange={this.handleChange} />
                                </label>
                            </div>
                            <div className="conversion-manager-add-form-action">
                                <label> ACTION - Which task will be marked as a conversion:
                                    <select name="action" value={this.state.action} onChange={this.handleChange}>
                                        <option value="ARRIVAL">ARRIVAL - Flag Arrivals To A Particular Page</option>
                                        <option value="NAVIGATE">NAVIGATE - Flags Arrivals To A Particular Page from Another Page</option>
                                        <option value="CLICK">CLICK - Flag Clicks On A Particular Page </option>
                                        <option value="INPUT">INPUT - Watch For Input to a Particular HTML Element</option>
                                        <option value="OTHER">OTHER - Make Your Conversion ACTION agnostic</option>
                                    </select>
                                </label>
                            </div>
                            {
                                this.state.action === 'CLICK' ?
                                (
                                    <div className="conversion-manager-add-form-additional-info">
                                        <label> Specify Specific Elements for Your Conversion: </label>
                                        <div className="conversion-manager-add-form-additional-info-inputs" >
                                            <label>Id of an element:<input name="id" onChange={this.handleIdentifiers} type="text" placeholder="ex. home-submit-button"/></label>
                                            <label>Class of an element:<input name="className" onChange={this.handleIdentifiers} type="text" placeholder="ex. btn"/></label>
                                            <label>Name of an element:<input name="name" onChange={this.handleIdentifiers} type="text" placeholder="ex. email-input"/></label>
                                            <label>Tag name of an element:<input name="tagName" onChange={this.handleIdentifiers} type="text" placeholder="ex. button"/></label>
                                            <label>Value of an element:<input name="value" onChange={this.handleIdentifiers} type="text" placeholder="ex. 73"/></label>
                                        </div>
                                    </div>
                                ) : null
                            }
                            <button className="btn white" type="submit" onClick={this.handleSubmit}>Submit Form</button>
                        </div>
                    ) : 
                    <button className="btn" onClick={() => this.setState({addFormVisible: true})}>Add A Conversion!</button> 
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
    conversions: state.conversions || []
  }
}

const mapDispatch = (dispatch) => {
    return {
        loadConversions(){
            dispatch(retrieveConversions())
        },
        addConversion(conversionToAdd){
            dispatch(createConversion(conversionToAdd))
        },
        removeConversion(conversionId){
            dispatch(deleteConversion(conversionId))
        }
    }
}
export default connect(mapState, mapDispatch)(ConversionManager)

/**
 * PROP TYPES
 */
ConversionManager.propTypes = {
  name: PropTypes.string,
  conversions: PropTypes.any
}
