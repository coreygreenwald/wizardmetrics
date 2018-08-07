const { Action, Customer, db, Journey } = require('../db');
const { journeys, compressor } = require('../utils');

const chalk = require('chalk');

const calculateJourneyInfoRunner = async () => {
    try {
        const customers = await Customer.findAll();
        for(let i = 0; i < customers.length; i++){
            let customer = customers[i];
            await customer.matchActionsToConversions()
            let journey = await journeys(customer.username);
            //call cacher on journey info
            journey.customerPublicId = customer.publicId
            let date = new Date();
            let newDate = date.toISOString().replace(/[-:,TZ]/g, '')
            journey.day = newDate.slice(0, newDate.length - 4); 
            if(customer.name !== "DemoAccount"){
                let journeyObj = await Journey.create(journey);
                compressor(customer.username, journeyObj.id, journeyObj.info, {model: 'IMPACT', weight: 'MOST'}, {conversionType: 'BOTH'})
            }
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

