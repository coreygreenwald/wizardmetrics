const express = require('express');
const router = express.Router();
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const path = require('path'); 

router.use(session({
    secret: process.env.SESSION_SECRET || 'corey and spencer making an app',
    store: new RedisStore({url: process.env.REDIS_URL}),
    resave: false,
    saveUninitialized: true,
}))

//deserialize a user off of a session. to be removed from here eventually
const { Customer, Conversion } = require('../../db');
router.use((req, res, next) => {
    if(req.session && req.session.customer){
        Customer.findOne({
            where: {
                username: req.session.customer
            },
            include: [
                { model: Conversion}
            ]
        })
            .then(customer => {
                req.customer = customer; 
                next(); 
            })
            .catch(next)
    } else {
        next();
    }
    // else {
    //     res.status(403); 
    //     next('That Action is Forbidden! 403');
    // }
})

router.use('/auth', require('./auth'));
router.use('/settings', require('./settings'));
router.use('/data', require('./data'));
router.use('/integrations', require('./integrations'));

router.use('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../../public/admin/index.html'));
})

module.exports = router;