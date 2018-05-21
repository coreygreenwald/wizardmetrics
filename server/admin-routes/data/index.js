const router = require('express').Router()
const { Customer, Session, Action } = require('../../../db');

router.use('/', (req, res, next) => {
    // console.log(req.customer);
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

module.exports = router; 