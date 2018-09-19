const { Action, Customer, db, Journey } = require('../db');
const { journeys, compressor } = require('../utils');
const client = require('../cache');
const chalk = require('chalk');

const defaultCustomer = process.env.CUSTOMER_TO_RUN || 'xeroshoes7100';
const calculateJourneyInfoRunner = async () => {
    try {
        const customers = await Customer.findAll();
        for(let i = 0; i < customers.length; i++){
            if(customers[i].username === defaultCustomer){
                let startTime = new Date();
                let customer = customers[i];
                let matchingStartTime = new Date();
                // await customer.matchActionsToConversions()
                console.log(chalk.yellow(customer.username + ' actions/conversions have been readjusted ' + (new Date() - matchingStartTime) + ' MS'));
                let journey = await journeys(customer.username, customer.publicId);
                //call cacher on journey info
                journey.customerPublicId = customer.publicId
                let date = new Date();
                let newDate = date.toISOString().replace(/[-:,TZ]/g, '')
                journey.day = newDate.slice(0, newDate.length - 4); 
                let journeyObj; 
                if(customer.name !== "DemoAccount"){
                    journeyObj = journey; 
                    journeyObj.id = 'RECENT'
                    let modelCompressionStartTime = new Date(); 
                    await compressor(customer.username, journeyObj.id, journeyObj.info, {model: 'IMPACT', weight: 'MOST'}, {conversionType: 'BOTH'})
                    console.log(chalk.yellow(customer.username + ' journey has been compressed through MOST IMPACT model ' + (new Date() - matchingStartTime) + ' MS'));
                    modelCompressionStartTime = new Date(); 
                    await compressor(customer.username, journeyObj.id, journeyObj.info, {model: 'COMMON', weight: 'MOST'}, {conversionType: 'BOTH'})
                    console.log(chalk.yellow(customer.username + ' journey has been compressed through MOST COMMON model ' + (new Date() - matchingStartTime) + ' MS'));
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
                let redisCacheStartTime = new Date(); 
                journeyObj.info = {};
                delete journeyObj.info;
                journeyObj = await Journey.create(journeyObj);
                await client.actions.setObj(`${customer.username}:JOURNEY:RECENT`, journeyObj || {})
                console.log(chalk.yellow(customer.username + ' journey has been cached through ' + (new Date() - redisCacheStartTime) + ' MS'));
                console.log(chalk.green('Journey Data Created for ', customer.username, 'TOTAL TIME: ', (new Date() - startTime) + ' MS'));
            } else {
                console.log(chalk.blue(`Company ${customers[i].username} has been ignored.`))
            }
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
