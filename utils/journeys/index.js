const { Session, Action, Customer, Conversion, Journey} = require('../../db');
const { deleteObjectKeys } = require('../general');
const _ = require('lodash');

const JOURNEY_MAXIMUM_LENGTH = process.env.JOURNEY_LENGTH_CAP || 20;

async function determineFutureConversions(actions){
    //TODO: In the future determine how far an action IS from a conversion
    let conversionCounter = {
        HARD: 0,
        SOFT: 0
    }
    for(let i = 0; i < actions.length; i++){
        let currAction = actions[i]; 
        if(currAction.isConversion){
            let conversionInfo = await Conversion.findById(currAction.conversionId);
            conversionCounter[conversionInfo.strength]++;
        }
    }
    return conversionCounter;
}

function deleteUnimportantReferrals(referrals){
    const keys = Object.keys(referrals);
    for(let i = 0; i < keys.length; i++){
        if(referrals[keys[i]] < 10){
            delete referrals[keys[i]];
        }
    }
    return referrals;
}

function journeyObjectRunner(journeyObj, cb){
    for(let i = 0; i < journeyObj.length; i++){
        for(let action in journeyObj[i]){
            const {metaData} = journeyObj[i][action];
            journeyObj[i][action].metaData.referrers = cb(metaData.referrers);
        }
    }
    return journeyObj;
}

const buildJourney = async (customerUsername, customerPublicId) => {
    try {
        const totalSessions = await Session.count({ where: { customerPublicId: customerPublicId }});
        console.log('TOTAL SESSIONS', totalSessions);
        let totalJourneys = 0;
        let completedJourneys = 0;
        let shortestJourneys = {
            byLength: [],
            byTime: {
                actions: [],
                time: Infinity
            }
        }
        //something about checking the length of each journey or something by time or by s
        let journeyInfo = [];
    
        //Check to ensure that customerInfo exists and sessions have been created. 
        // for(let offset = 0; offset < totalSession)
        let offset = 0;
        let limit = 1000;
        while(offset < totalSessions){
            let remainingSessions = totalSessions - offset;
            if(remainingSessions < 1000){
                limit = remainingSessions - 1;
            }
            console.log(offset + ' sessions complete for ' + customerUsername);
            let customerInfo = await Customer.findSessionsAndActions(customerUsername, offset, limit);
            offset += 1000;
            if(customerInfo && customerInfo.sessions){
                let sessions = customerInfo.sessions;
                //Loop over each session that exists for each customer.
                for(let i = 0; i < sessions.length; i++){
                    let actions = sessions[i].actions && sessions[i].actions.length ? sessions[i].actions : [];
                    //This variable is to separate journeys by conversion
                    let endOfJourneyPointer = 0;
                    let endOfJourneyTimer = 0;
                    // let sessionModulus = 0;
                    //Loop over each action that exists for each session.
                    // if(actions.length > 20) console.log('NO SESSIONS FOUND FOR SESSION', sessions[i].id)
                    let conversionCounter = await determineFutureConversions(actions);
                    if(conversionCounter.HARD) completedJourneys++;
                    let journeyLengthCap = Math.min(actions.length, JOURNEY_MAXIMUM_LENGTH);
                    for(let j = 0; j < actions.length; j++){
                        let currAction = actions[j].toJSON();
                        let journeyInfoPosition = j - endOfJourneyPointer; 
                        //Do all work regarding time stamps here before deletion.
                        let secondsOnAction = !currAction.isConversion && actions[j + 1] ? (actions[j + 1].toJSON().createdAt - currAction.createdAt) / 1000 : null;
                        let savedId = currAction.id
                        let referrer = currAction.referrer;
                        deleteObjectKeys(currAction, ['id', 'createdAt', 'updatedAt', 'sessionId', 'referrer']); 
                        if(j < journeyLengthCap){
                            if(!journeyInfo[journeyInfoPosition]){
                                journeyInfo[journeyInfoPosition] = [];
                            }
                            let foundAction = false;
                            //Go over all actions found at this position.
                            for(action in journeyInfo[journeyInfoPosition]){
                                let {metaData, actionData} = journeyInfo[journeyInfoPosition][action];
                                if(_.isEqual(actionData, currAction)){
                                    metaData.count += 1;
                                    metaData.secondsOnAction += secondsOnAction; 
                                    // metaData.actionIds.push(savedId);
                                    metaData.futureConversionCounter.hard += conversionCounter.HARD;
                                    metaData.futureConversionCounter.soft += conversionCounter.SOFT;
                                    //Remember ot clean up null pointers in the future
                                    metaData.referrers[referrer] = metaData.referrers[referrer] + 1 || 1;
                                    if(sessions[i].userIdentifier && j === actions.length - 1){
                                        metaData.identifiers.push(sessions[i].userIdentifier);
                                    }
                                    journeyInfo[journeyInfoPosition][action] = {actionData, metaData};
                                    foundAction = true;
                                    break;
                                }
                            }
                            if(!foundAction) {
                                const identifiers = (sessions[i].userIdentifier && j === actions.length - 1) ? [sessions[i].userIdentifier] : [];
                                journeyInfo[journeyInfoPosition].push({
                                    actionData: currAction, 
                                    metaData: {
                                        count: 1, 
                                        secondsOnAction, 
                                        // actionIds: [currAction.id], 
                                        referrers: {[referrer]: 1}, 
                                        identifiers,
                                        futureConversionCounter: {
                                            hard: 0,
                                            soft: 0
                                        }
                                    }
                                });
                            }
                            if(currAction.isConversion) { 
                                if((shortestJourneys.byLength.length > journeyInfoPosition) || shortestJourneys.byLength.length === 0){
                                    shortestJourneys.byLength = actions.slice(endOfJourneyPointer, j + 1);
                                }
                                if(shortestJourneys.byTime.time > endOfJourneyTimer){
                                    shortestJourneys.byTime.time = endOfJourneyTimer; 
                                    shortestJourneys.byTime.actions = actions.slice(endOfJourneyPointer, j + 1);
                                }
                                endOfJourneyPointer =  j + 1;
                                let actualConversion = await Conversion.findById(currAction.conversionId);
                                // completedJourneys++;
                                if(actualConversion.strength === 'HARD'){
                                    break;
                                } else if(actions[j + 1]){
                                    // totalJourneys++;
                                }
                            } else {
                                endOfJourneyTimer += secondsOnAction;
                            }
                        }  
                    }
                    totalJourneys++;
                }
            } else {
                throw new Error(`Customer ${username} doesn't exist or have any existing sessions`)
            }
            console.log('TOTAL JOURNEYS', totalJourneys);
        }
        let deleteReferralKeysStartTime = new Date();
        journeyInfo = journeyObjectRunner(journeyInfo, deleteUnimportantReferrals);
        console.log('Referral key deletion total executable time: ', (new Date() - deleteReferralKeysStartTime), 'MS');
        return {
            info: journeyInfo,
            completedJourneys: completedJourneys,
            totalJourneys: totalJourneys,
            shortestJourneyTime: shortestJourneys.byTime.time,
            shortestJourneyByTime: shortestJourneys.byTime.actions.map(action => action.id),
            shortestJourneyLength: shortestJourneys.byLength.length,
            shortestJourneyByLength: shortestJourneys.byLength.map(action => action.id)
        }
    } catch (err){
        console.log(err);
    } 
}

module.exports = buildJourney;