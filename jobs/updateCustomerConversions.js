const { Action, Customer, db, Journey } = require('../db');
const { journeys, compressor } = require('../utils');
const client = require('../cache');
const chalk = require('chalk');

const updateCustomerConversions = async (username) => {
    let customer = await Customer.findOne({
        where: {
            username: username
        }
    });
    if(customer){
        await customer.matchActionsToConversions()
    } else {
        console.log('CUSTOMER NOT FOUND!'); 
    }
}

db.sync()
    .then(() => {
        return updateCustomerConversions(process.env.USERNAME);
    })
    .catch((err) => {
        console.log(chalk.red('ERROR OCCURRED!', err));
    })
    .finally(() => {
        console.log(chalk.green('MISSION COMPLETE'));
        db.close(); 
    })
