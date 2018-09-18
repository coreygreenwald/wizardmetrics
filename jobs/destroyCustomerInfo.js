const { Action, Customer, Session, db, Journey } = require('../db');
const client = require('../cache');
const chalk = require('chalk');
const Op = require('sequelize').Op;

async function destroyInfo(username){
    let startTime = new Date();
    const customers = await Customer.findAll();
    for(let i = 0; i < customers.length; i++){
        let customer = customers[i]; 
        if(customer.username === username){
            // let actionTimer = new Date();
            // let sessions = await customer.getSessions();
            // sessions = sessions.map(session => session.id)
            // let intervalNum = setInterval(() => {
            //     console.log('Process Ticker', (new Date() - startTime));
            // }, 300000)
            // await Action.destroy({
            //     where: {
            //         sessionId: {
            //             [Op.in]: sessions
            //         }
            //     }
            // })
            // console.log(chalk.yellow('Time for Action Deletion: ', new Date() - actionTimer));
            let sessionDestroyTimer = new Date();
            await Session.destroy({
                where: {
                    customerPublicId: customer.publicId
                }
            })
            console.log(chalk.yellow('Time for Session Deletion: ', new Date() - sessionDestroyTimer));
            let journeyDestroyTimer = new Date();
            await Journey.destroy({
                where: {
                    customerPublicId: customer.publicId
                }
            })
            clearInterval(intervalNum);
            console.log(chalk.yellow('Time for Journey Deletion: ', new Date() - journeyDestroyTimer));
        
            console.log(sessions.length)
        }
    }
    console.log(chalk.green('Total Time:', new Date() - startTime))
} 

(async function(){
    try {
        await db.sync();
        await destroyInfo(process.env.USERNAME);
        console.log(chalk.green('Mission Success!'))
    } catch(err){
        console.log(chalk.red(new Date(), 'destroyCustomerInfo Job Failed', err))
    } finally {
        db.close(); 
    }
})()