const router = require('express').Router()
const { Customer, Session, Action, Conversion } = require('../../db');

router.put('/', (req, res, next) => {
    if(req.customer){
        return req.customer.update({
            sessionInfoGrabber: req.body.sessionInfoGrabber
        }).then(updatedCustomer => {
            res.json(updatedCustomer)
        }).catch(next);
    } else {
        res.status(403).send('Forbidden!');
    }
})
module.exports = router;
