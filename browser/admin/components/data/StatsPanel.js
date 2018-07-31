import { kFormatter } from '../../utils';
import React, { Component } from 'react'

export default class AdminPanel extends Component {
    constructor(props){
        super(props); 
        this.state = {
            showStatsMetrics: false
        }
    }
    render(){
        const {actionData, percent, occurrences, time, totalCount, referrers, identifiers, conversionsAtStep, allIdentifiers, metaData } = this.props.currItem || {}
        const { activeItemNum, showReferrersFunc, showUsersFunc } = this.props
        const conversionIndicator = metaData ? (metaData.futureConversionCounter.hard / occurrences).toFixed(2) : 0;
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
                                    <h2>{time} Seconds</h2>
                                    <p>Avg Time On {actionData.path}</p>
                                </div>
                                <div className="admin-panel-funnel-stats-metrics-metric">
                                    <h2>{conversionIndicator}</h2>
                                    <p>Conversion Likelihood</p>
                                </div>
                                <div className="admin-panel-funnel-stats-metrics-metric">
                                    <h2>{Object.keys(referrers).length}</h2>
                                    <p>Referral Sources to Action</p>
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
                                    <div className="admin-panel-funnel-stats-metrics-metric">
                                        <h3>/placeholder - 13%</h3>
                                        <h3>/other - 9%</h3>
                                    </div>
                                    <p>Other Actions at Step {activeItemNum + 1}</p>
                                </div>
                            </div>
                        )
                    }
                </div>
                {
                nextItem && nextItem.actionData ? 
                (
                    <div className="admin-panel-funnel-stats-recommendations">
                    <h2>Recommendations</h2>
                    <p>You have {identifiers.length} users stuck on this action. It is suggested to export a list of these users and send them an email to get them to {nextItem.actionData.path} as the suggested next step on their journey.</p>
                    </div>
                ) : null
                }
                <div className="admin-panel-funnel-stats-actions">
                <h2>Actions</h2>
                <div className="admin-panel-funnel-stats-actions-body">
                {
                        identifiers && identifiers.length ?
                        (
                            <div className="admin-panel-funnel-item-users">
                                <button className="btn" onClick={showUsersFunc}>See Customers</button>
                            </div>
                        ) : null
                    }
                    {
                        referrers && Object.keys(referrers).length ?
                        (
                            <div className="admin-panel-funnel-item-referrals">
                                <button className="btn" onClick={showReferrersFunc}>See Referrals</button>
                            </div>
                        ) : null
                    }
                    {
                    ((identifiers && identifiers.length) || (referrers && Object.keys(referrers).length)) ? null : (
                        <h2> No actions to take at this step </h2>
                    )
                    }
                </div>
            </div>
          </div>
        )
    }
}
