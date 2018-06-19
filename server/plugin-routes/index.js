const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const { db, Action, Session, Customer } = require('../../db')

router.use('/data', (req, res, next) => {
    if(req.query.wizardId){
        Customer.findOne({
            where: {
                publicId: req.query.wizardId
            }
        })
        .then(customer => {
            //TODO catch if customer is not found.
            req.customer = customer;
            next();
        })
        .catch(next);
    } else {
        res.sendStatus(403);
    }
})

router.post('/data', (req, res, next) => {
    console.log(req.body.session)
    if(!req.body.session || !req.body.session.length){
        req.body.session = crypto.randomBytes(20).toString('hex');
    }
    Session.findOrCreate({
        where: {
            id: req.body.session,
            customerPublicId: req.customer.publicId
        }
    })
    .then(([session, created]) => {
        req.session = session;
        req.body = req.body.payload;
        next();
    })
    .catch(next);

})

router.post('/data', (req, res, next) => {
    Action.create({
        type: req.body.type.toUpperCase(),
        path: req.body.path,
        info: req.body.info || {},
        sessionId: req.session.id
    }).then(action => {
        res.send({sessionId: req.session.id});
    }).catch(next);
})

router.use('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../../public/plugin/bundle.js'));
})

module.exports = router;