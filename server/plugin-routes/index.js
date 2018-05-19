const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const { db, Action, Session, Customer } = require('../../db')

router.use('/data', (req, res, next) => {
    // console.log(req.query);
    if(req.query.wizardId){
        Customer.findOne({
            publicId: req.query.wizardId
        })
        .then(customer => {
            req.customer = customer;
            next();
        })
        .catch(next);
    } else {
        res.sendStatus(403);
    }
})

router.post('/data', (req, res, next) => {
    if(req.body.session && req.body.session.includes('sessionId')){
        req.body.session = req.body.session.slice(10);
    } else {
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
    })
})

router.use('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../../public/bundle.js'));
})

module.exports = router;