const db = require('../_db');
const Sequelize = require('sequelize');
const crypto = require('crypto'); 
const Session = require('./Session'); 
const Action = require('./Action');
const _ = require('lodash');
const { deleteObjectKeys } = require('../../utils/general');

const Customer = db.define('customer', {
    publicId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    location: {
        type: Sequelize.STRING, 
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
    },
    salt: {
        type: Sequelize.STRING,
    }
})

Customer.prototype.validatePassword = function (candidatePwd) {
    return Customer.encryptPassword(candidatePwd, this.salt) === this.password
}

Customer.prototype.toJSON = function () {
    let values = Object.assign({}, this.get());
    delete values.password;
    delete values.salt;
    return values;
}

Customer.generateSalt = function () {
    return crypto.randomBytes(16).toString('base64')
}

Customer.encryptPassword = function (plainText, salt) {
    return crypto.createHash('RSA-SHA256').update(plainText).update(salt).digest('hex')
}

Customer.findSessionsAndActions = function(username){
    return Customer.findOne({
        where: {
            username: username
        },
        include: [{
            model: Session, 
            include: [{
                model: Action
            }]
        }]
    })
}

const setSaltAndPassword = customer => {
    if (customer.changed('password')) {
        customer.salt = Customer.generateSalt()
        customer.password = Customer.encryptPassword(customer.password, customer.salt)
    }
}

Customer.addHook('beforeValidate', (customer) => {
    customer.publicId = crypto.randomBytes(20).toString('hex');
    // TODO: eventually generate more unique usernames. disabled for testing and alpha. 
    customer.username = customer.name + crypto.randomBytes(2).toString('hex');
})


Customer.calculateJourneyInfo = async (username) => {
    try {
        const customerInfo = await Customer.findSessionsAndActions(username);
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
        const journeyInfo = [];
    
        //Check to ensure that customerInfo exists and sessions have been created. 
        if(customerInfo && customerInfo.sessions){
            let sessions = customerInfo.sessions;
            // let  = []; 
            //Loop over each session that exists for each customer.
            for(let i = 0; i < sessions.length; i++){
                let actions = sessions[i].actions && sessions[i].actions.length ? sessions[i].actions : [];
                //This variable is to separate journeys by conversion
                let endOfJourneyPointer = 0;
                let endOfJourneyTimer = 0;
                let sessionModulus = 0;
                //Loop over each action that exists for each session.
                for(let j = 0; j < actions.length; j++){
                    let currAction = actions[j].toJSON();
                    //Do all work regarding time stamps here before deletion.
                    let secondsOnAction = !currAction.isConversion && actions[j + 1] ? (actions[j + 1].toJSON().createdAt - currAction.createdAt) / 1000 : null;
                    deleteObjectKeys(currAction, ['id', 'createdAt', 'updatedAt', 'sessionId']); 
                    if(!journeyInfo[j]){
                        journeyInfo[j] = new Map(); 
                    }
                    let foundAction = false;
                    for(action of journeyInfo[j - endOfJourneyPointer]){
                        let [keyObj, actionData] = action;
                        if(_.isEqual(keyObj, currAction)){
                            actionData.count += 1;
                            actionData.secondsOnAction += secondsOnAction; 
                            journeyInfo[j - endOfJourneyPointer].set(keyObj, actionData);
                            foundAction = true;
                            break;
                        }
                    }
                    if(!foundAction) journeyInfo[j].set(currAction, {count: 1, secondsOnAction});
                    if(currAction.isConversion) { 
                        if(shortestJourneys.byLength.length > (j - sessionModulus) || shortestJourneys.byLength.length === 0){
                            shortestJourneys.byLength = actions.slice(sessionModulus, j + 1);
                        }
                        if(shortestJourneys.byTime.time > endOfJourneyTimer){
                            shortestJourneys.byTime.time = endOfJourneyTimer; 
                            shortestJourneys.byTime.action = actions.slice(sessionModulus, j + 1);
                        }
                        sessionModulus = j; 
                        completedJourneys++;
                        if(actions[j + 1]){
                            totalJourneys++;
                        }
                    } else {
                        endOfJourneyTimer += secondsOnAction;
                    }
                }
                totalJourneys++;
            }
            return {
                info: journeyInfo,
                completedJourneys: completedJourneys,
                totalJourneys: totalJourneys,
                shortestJourneyTime: shortestJourneys.byTime.time,
                shortestJourneyByTime: shortestJourneys.byTime.actions.map(action => action.id),
                shortestJourneyLength: shortestJourneys.byLength.length,
                shortestJourneyByLength: shortestJourneys.byLength.map(action => action.id)
            }
        } else {
            throw new Error(`Customer ${username} doesn't exist or have any existing sessions`)
        }
    } catch (err){
        console.log(err);
    } 
}

Customer.beforeCreate(setSaltAndPassword)
Customer.beforeUpdate(setSaltAndPassword)

module.exports = Customer;
