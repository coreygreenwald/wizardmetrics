const { Action, Customer, db, Journey } = require('../db');
const chalk = require('chalk');

const calculateJourneyInfoRunner = async () => {
    try {
        const customers = await Customer.findAll();
        for(let i = 0; i < customers.length; i++){
            let customer = customers[i];
            let journey = await Customer.calculateJourneyInfo(customer.username);
            journey.customerPublicId = customer.publicId
            await Journey.create(journey);
            if(i == 0) console.log(journey);
            console.log(chalk.green('Journey Data Created for ', customer.username));
        }
    } catch(err){
        console.log('There was an error running the job!', err);
    }
}
db.sync()
    .then(calculateJourneyInfoRunner)
    .catch(() => {
        console.log(chalk.red(new Date(), 'calculateJourneyInfo Job Failed'))
    })

