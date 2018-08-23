const router = require('express').Router()
const { Customer, Session, Action, Conversion } = require('../../db');

router.put('/', (req, res, next) => {
    delete req.body.username;
    delete req.body.publicId;
    delete req.body.password; 

    if(req.customer){
        return req.customer
            .update(req.body)
            .then(updatedCustomer => {
                res.json(updatedCustomer)
            }).catch(next);
    } else {
        res.status(403).send('Forbidden!');
    }
})
module.exports = router;
