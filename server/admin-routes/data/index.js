const router = require('express').Router()
const { Customer, Session, Action, Conversion } = require('../../../db');

router.use('/journeys', require('./journeys')); 

router.get('/', (req, res, next) => {
    if(req.customer){
        Customer.findSessionsAndActions(req.customer.username)
            .then(customerWithSessionAndActions => {
                res.json(customerWithSessionAndActions)
            })
            .catch(next);
    } else {
        res.status(403).send('Forbidden!');
    }
})

router.post('/conversions', (req, res, next) => {
    if(req.customer && req.customer.username === req.body.username){
        const conversion = req.body.conversion;
        conversion.customerPublicId = req.customer.publicId;
        Conversion.create(req.body.conversion)
            .then(conversion => {
                res.send('conversion added!');
            })
            .catch(next);
    } else {
        res.status(403).send('Forbidden'); 
    }
})

module.exports = router; 