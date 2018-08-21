const { Action, Customer, db, Journey } = require('../db');
const { journeys, compressor } = require('../utils');
const client = require('../cache');
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
            let journeyObj; 
            if(customer.name !== "DemoAccount"){
                journeyObj = await Journey.create(journey);
                await compressor(customer.username, journeyObj.id, journeyObj.info, {model: 'IMPACT', weight: 'MOST'}, {conversionType: 'BOTH'})
                await compressor(customer.username, journeyObj.id, journeyObj.info, {model: 'COMMON', weight: 'MOST'}, {conversionType: 'BOTH'})
            } else {
                [journeyObj] = await Journey.findAll({
                    limit: 1,
                    where: {
                        customerPublicId: customer.publicId
                    }, 
                    order: [ [ 'createdAt' ]]
                  })
                // journeyObj = {
                //     id: 5,
                //     info: {}
                // }
                await compressor(customer.username, journeyObj.id, journeyObj.info, {model: 'IMPACT', weight: 'MOST'}, {conversionType: 'BOTH'})
                await compressor(customer.username, journeyObj.id, journeyObj.info, {model: 'COMMON', weight: 'MOST'}, {conversionType: 'BOTH'})
                console.log('succeeded!!!');
            }
            await client.actions.setObj(`${customer.username}:JOURNEY:RECENT`, journeyObj || {})
            console.log(chalk.green('Journey Data Created for ', customer.username));
        }
        // await db.close();
    } catch(err){
        console.log('There was an error running the job!', err);
    }
}

(async function(){
    try {
        await calculateJourneyInfoRunner();
        console.log(chalk.green('Mission Success!'))
    } catch(err){
        console.log(chalk.red(new Date(), 'calculateJourneyInfo Job Failed'))
    } finally {
        db.close(); 
    }
})()
// db.sync()
//     .then(calculateJourneyInfoRunner)
//     .then(() => console.log(chalk.green('Mission Success!')))
//     .catch(() => {
//         console.log(chalk.red(new Date(), 'calculateJourneyInfo Job Failed'))
//     })
//     .finally(() => db.close())
