const { Action, Customer, db } = require('../db');

const calculateJourneyInfoRunner = async () => {
    try {
        const customers = await Customer.findAll();
        for(let i = 0; i < customers.length; i++){
            let customer = customers[i];
            let customerJourneyInfo = await Customer.calculateJourneyInfo(customer.username);
            // console.log(customerJourneyInfo); 
            //cache this thing!
        }
        await db.close();
    } catch(err){
        console.log('There was an error running the job!', err);
    }
}

calculateJourneyInfoRunner();