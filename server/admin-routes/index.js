const express = require('express');
const router = express.Router();
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const path = require('path'); 

router.use(session({
    secret: process.env.SESSION_SECRET || 'corey and spencer making an app',
    store: new RedisStore(),
    resave: false,
    saveUninitialized: true,
}))

router.use('/auth', require('./auth'));

router.use('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../../admin/index.html'));
})

module.exports = router;