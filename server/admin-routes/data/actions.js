const router = require('express').Router()
const { Customer, Session, Action, Conversion } = require('../../../db');

// router.get('/', async (req, res, next) => {
//     try {
//         const stuff = await Customer.findSessionsAndActions(req.customer.username);
//         console.log(stuff);
//     } catch(err){
//         next(err); 
//     }
// })

module.exports = router;