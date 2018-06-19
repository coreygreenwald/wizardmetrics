const db = require('../_db');
const Conversion = require('./Conversion');
const Sequelize = require('sequelize');

const Action = db.define('action', {
    type: {
        type: Sequelize.ENUM('ARRIVAL', 'CLICK', 'INPUT', 'OTHER'),
        defaultValue: 'OTHER'
    },
    path: {
        type: Sequelize.STRING
    },
    info: {
        type: Sequelize.JSONB
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
            if(conversions[i].compareActionToConversion(action)){
                action.isConversion = true;
                action.setConversion(conversions[i]);
                return;
            }
        }
    } catch(err){
        console.log(err);
    }
})