const db = require('../_db');
const Conversion = require('./Conversion');
const _ = require('lodash');
const Sequelize = require('sequelize');

const Action = db.define('action', {
    type: {
        type: Sequelize.ENUM('ARRIVAL', 'CLICK', 'NAVIGATE', 'INPUT', 'OTHER'),
        defaultValue: 'OTHER'
    },
    path: {
        type: Sequelize.STRING
    },
    info: {
        type: Sequelize.JSONB
    },
    referrer: {
        type: Sequelize.STRING
    },
    isConversion: {
        type: Sequelize.BOOLEAN
    }
})

module.exports = Action;

Action.hook('beforeCreate', async (action) => {
    try {
        let session = await action.getSession();
        let customer = await session.getCustomer(); 
        let conversions = await customer.getConversions();
        for(let i = 0; i < conversions.length; i++){
            let referrer = action.referrer;
            delete action.referrer;
            if(conversions[i].compareActionToConversion(action)){
                action.isConversion = true;
                action.conversionId = conversions[i].id;
                return;
            }
            action.referrer = referrer;
        }
    } catch(err){
        console.log(err);
    }
})