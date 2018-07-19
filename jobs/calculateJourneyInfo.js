const { Action, Customer, db, Journey } = require('../db');
const { journeys } = require('../utils');

const chalk = require('chalk');

const calculateJourneyInfoRunner = async () => {
    try {
        const customers = await Customer.findAll();
        for(let i = 0; i < customers.length; i++){
            let customer = customers[i];
            let journey = await journeys(customer.username);
            journey.customerPublicId = customer.publicId
            let date = new Date();
            let newDate = date.toISOString().replace(/[-:,TZ]/g, '')
            journey.day = newDate.slice(0, newDate.length - 4); 
            await Journey.create(journey);
            console.log(chalk.green('Journey Data Created for ', customer.username));
        }
        await db.close();
    } catch(err){
        console.log('There was an error running the job!', err);
    }
}
db.sync()
    .then(calculateJourneyInfoRunner)
    .catch(() => {
        console.log(chalk.red(new Date(), 'calculateJourneyInfo Job Failed'))
    })

