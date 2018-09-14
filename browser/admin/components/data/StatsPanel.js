import { kFormatter, timeFormatter } from '../../utils';
import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export default class AdminPanel extends Component {
    constructor(props){
        super(props); 
        this.state = {
            showStatsMetrics: false
        }
    }
    render(){
        const {actionData, percent, occurrences, time, totalCount, referrers, identifiers, conversionsAtStep, allIdentifiers, metaData, breakCounter, totalBreaks } = this.props.currItem || {}
        const { activeItemNum, showReferrersFunc, showUsersFunc } = this.props
        const conversionIndicator = metaData ? (metaData.futureConversionCounter.hard / occurrences * 100).toFixed(2) : 0;
        const nextItem = this.props.nextItem || null;
        return (
            <div className="admin-panel-funnel-stats">
                <div className="admin-panel-funnel-stats-header">
                    <h1> Metrics / Step {activeItemNum + 1} </h1>
                    <div className="admin-panel-funnel-stats-selector tab">
                        <button className={`tablinks ${!this.state.showStatsMetrics ? 'active' : ''}`}  onClick={() => this.setState({showStatsMetrics: false})}>This Action</button>
                        <button className={`tablinks ${this.state.showStatsMetrics ? 'active' : ''}`} onClick={() => this.setState({showStatsMetrics: true})}>How It Stacks Up</button>
                    </div>
                </div>
                <div className="admin-panel-funnel-stats-metrics">
                    {
                        !this.state.showStatsMetrics ? (
                            <div className="admin-panel-funnel-stats-metrics-block">
                                <div className="admin-panel-funnel-stats-metrics-metric">
                                    <h2>{kFormatter(occurrences)}</h2>
                                    <p>People at {actionData.path}</p>
                                </div>
                                <div className="admin-panel-funnel-stats-metrics-metric">
                                    {/* We may want to use totalCount here */}
                                    <h2>{nextItem ? Math.floor((occurrences - nextItem.occurrences) / occurrences * 100) : 'N/A'}%</h2>
                                    <p>Avg Bounce Rate for Action</p>
                                </div>
                                <div className="admin-panel-funnel-stats-metrics-metric">
                                    <h2>{identifiers.length}</h2>
                                    <p>Users Stuck on Action</p>
                                </div>
                                <div className="admin-panel-funnel-stats-metrics-metric">
                                    <h2>{timeFormatter(time)}</h2>
                                    <p>Avg Time On {actionData.path}</p>
                                </div>
                                <div className="admin-panel-funnel-stats-metrics-metric">
                                    <h2>{conversionIndicator}%</h2>
                                    <p>Conversion Likelihood</p>
                                </div>
                                <div className="admin-panel-funnel-stats-metrics-metric">
                                    <h2>{breakCounter}</h2>
                                    <p>Breaks Taken</p>
                                </div>
                            </div>
                        ) : (
                            <div className="admin-panel-funnel-stats-metrics-block">
                                <div className="admin-panel-funnel-stats-metrics-metric">
                                    <h2>{kFormatter(totalCount)}</h2>
                                    <p># of Users at Step {activeItemNum + 1}</p>
                                </div>
                                <div className="admin-panel-funnel-stats-metrics-metric">
                                    {/* We may want to use totalCount here */}
                                    <h2>{nextItem ? Math.floor((totalCount - nextItem.totalCount) / totalCount * 100) : 'N/A'}%</h2>
                                    <p>Avg Bounce Rate for Step {activeItemNum + 1}</p>
                                </div>
                                <div className="admin-panel-funnel-stats-metrics-metric">
                                    <h2>{allIdentifiers.length}</h2>
                                    <p>Users Stuck on Step</p>
                                </div>
                                <div className="admin-panel-funnel-stats-metrics-metric">
                                    <h2>{percent.toFixed(2)}%</h2>
                                    <p>Action Prevalence</p>
                                </div>
                                <div className="admin-panel-funnel-stats-metrics-metric">
                                    <h2>{kFormatter(conversionsAtStep)}</h2>
                                    <p>Conversions at Step {activeItemNum + 1}</p>
                                </div>
                                <div className="admin-panel-funnel-stats-metrics-metric">
                                    <h2>{totalBreaks}</h2>
                                    <p>Breaks Taken at Step {activeItemNum + 1}</p>
                                </div>
                            </div>
                        )
                    }
                </div>
                {/* {
                nextItem && nextItem.actionData ? 
                (
                    <div className="admin-panel-funnel-stats-recommendations">
                    <h2>Recommendations</h2>
                    <p>You have {identifiers.length} users stuck on this action. It is suggested to export a list of these users and send them an email to get them to {nextItem.actionData.path} as the suggested next step on their journey.</p>
                    </div>
                ) : null
                } */}
                <div className="admin-panel-funnel-stats-actions">
                <h2>Actionable Insights</h2>
                <div className="admin-panel-funnel-stats-actions-body">
                {
                        identifiers && identifiers.length && identifiers.length > 10 && nextItem && nextItem.actionData ?
                        (
                            <div className="admin-panel-funnel-stats-actions-recommendation">
                                <li>{identifiers.length} users are stuck on this action and {allIdentifiers.length} users have stopped at this step! Export these users and try to get them to {nextItem.actionData.path} <button className="btn" onClick={showUsersFunc}>See Customers</button></li>
                            </div>
                        ) : null
                    }
                    {
                        referrers && Object.keys(referrers).length ?
                        (
                            <div className="admin-panel-funnel-stats-actions-recommendation">
                                <li>{Object.keys(referrers).length} sources have been found for this action. Check out which are most helpful and which are not working quite right!<button className="btn" onClick={showReferrersFunc}>See Referrals</button></li>
                            </div>
                        ) : null
                    }
                    {
                        time > 900 ?
                        (
                            <div className="admin-panel-funnel-stats-actions-recommendation">
                                <li>The average time spent here is much longer than your other actions. We suspect a lot of people have left or been diverted from their journey. Consider adding some conversion markers to focus on the problems within {actionData.path} <Link to="/conversions"><button className="btn">Manage Conversions</button></Link></li>
                            </div>
                        ) : null
                    }
                    {
                    ((identifiers && identifiers.length) || (referrers && Object.keys(referrers).length) || (time > 900)) ? null : (
                        <p> No actionable insights on this step </p>
                    )
                    }
                </div>
            </div>
          </div>
        )
    }
}
