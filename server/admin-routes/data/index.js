const router = require('express').Router()
const { Customer, Session, Action, Conversion } = require('../../../db');

router.use('/journeys', require('./journeys')); 
router.use('/conversions', require('./conversions')); 
router.use('/actions', require('./actions'));

router.get('/', (req, res, next) => {
    if(req.customer){
        // Customer.findSessionsAndActions(req.customer.username)
        //     .then(customerWithSessionAndActions => {
        //         res.json(req.customer)
        //     })
        //     .catch(next);
        res.json(req.customer);
    } else {
        res.status(403).send('Forbidden!');
    }
})

module.exports = router; 