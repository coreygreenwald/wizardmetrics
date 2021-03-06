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
            if(!customer){
                res.status(404).send(`Cannot Find Customer With Public Id ${req.query.wizardId}` )
            } else {
                req.customer = customer;
                next();
            }
        })
        .catch(next);
    } else {
        res.status(403).send('This Action is Forbidden');
    }
})

router.post('/data', (req, res, next) => {
    //Ensure they started at the designated starting point.
    if(req.body.session || !req.customer.startingPoint || req.customer.startingPoint === req.body.payload.path){
        if(!req.body.session || !req.body.session.length){
            req.body.session = crypto.randomBytes(20).toString('hex');
            req.body.payload.type = 'ARRIVAL'; //TODO: Allow navigate and arrival events to coincide.
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
    } else {
        res.send('200').status('Data Untracked Until User Reaches Starting Point.')
    }
})

router.post('/data', (req, res, next) => {
    Action.create({
        type: req.body.type.toUpperCase(),
        path: req.body.path,
        info: req.body.info || {},
        referrer: req.body.referrer,
        sessionId: req.session.id
    }).then(action => {
        res.status(201).send({sessionId: req.session.id});
    }).catch(next);
})

router.get('/data/userInfo', (req, res, next) => {
    if(req.customer){
        res.status(200).send(req.customer.sessionInfoGrabber)
    } else {
        res.status(404).send('Cannot')
    }
})

router.put('/data/userInfo', (req, res, next) => {
    if(req.customer){
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
            return session.update({userIdentifier: req.body.userIdentifier})
        })
        .then((updatedSession) => {
            res.status(203).send('User Identification Updated');
        })
        .catch(next);
    } else {
        res.status(404).send('Cannot')
    }
})

router.use('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../../public/plugin/bundle.js'));
})

module.exports = router;