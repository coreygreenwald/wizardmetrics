const db = require('../_db');
const Sequelize = require('sequelize');
const { Op } = Sequelize
const crypto = require('crypto'); 
const Session = require('./Session'); 
const Action = require('./Action');
const Conversion = require('./Conversion');
const conversionUtils = require('../../utils/conversions');
const _ = require('lodash');

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
    originURL: {
        type: Sequelize.STRING,
        validate: {
            isUrl: true
        }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    originUrl: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.ENUM('FREE', 'BASIC', 'PREMIUM', 'ALL', 'SUPER_ADMIN'),
        defaultValue: 'FREE'
    },
    sessionInfoGrabber: {
        type: Sequelize.JSON,
        defaultValue: {
            submitId: '',
            submitType: 'ID',
            dataLocationId: '',
            dataLocationType: 'ID'
        }
    },
    location: {
        type: Sequelize.STRING, 
        allowNull: false
    },
    //In seconds, time until we consider that someone left this action.
    timeForLeave: {
        type: Sequelize.INTEGER,
        defaultValue: 900
    },
    startingPoint: {
        type: Sequelize.STRING,
        defaultValue: null,
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

Customer.prototype.matchActionsToConversions = async function() {
    try {
        let startTime = new Date();
        let sessions = await Session.findAll({
            where: {
                customerPublicId: this.publicId
            }, include: [{
                model: Action
            }]
        })
        console.log('Time to find sessions', new Date() - startTime);
        let actionStartTime = new Date();
        setInterval(() => {
            console.log('Time Elapsed on Matching Actions', new Date() - actionStartTime); 
        }, 300000)
        let conversions = await this.getConversions();
        for(let i = 0; i < sessions.length; i++){
            let actions = sessions[i].actions;
            await Promise.all(actions.map(action => {
                action = conversionUtils.compareActionToConversions(action, conversions);
                return action.save();
            }))
        }
        console.log('Time to update actions', new Date() - actionStartTime);
    } catch(err){
        console.log('There was an error rematching conversions!', err); 
    }
    return false;
}

Customer.generateSalt = function () {
    return crypto.randomBytes(16).toString('base64')
}

Customer.encryptPassword = function (plainText, salt) {
    return crypto.createHash('RSA-SHA256').update(plainText).update(salt).digest('hex')
}

Customer.findSessionsAndActions = async function(username, currentOffset, currentLimit = 1000){
    const customer = await Customer.findOne({
        where: {
            username: username
        }
    })
    const sessions = await Session.findAll({
        where: {
            customerPublicId: customer.publicId
        },
        limit: currentLimit,
        offset: currentOffset,
        // order: [['createdAt']],
        include: [{
            model: Action
        }]
    })
    customer.sessions = sessions;
    return customer;
    // return Customer.findOne({
    //     where: {
    //         username: username
    //     },
    //     include: [{
    //         model: Session,
    //         include: [{
    //             model: Action
    //         }]
    //     }]
    //     //LIMIT AND OFFSET. 
    // })
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

Customer.beforeCreate(setSaltAndPassword)
Customer.beforeUpdate(setSaltAndPassword)

module.exports = Customer;
