const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const session = require('express-session')
// const SequelizeStore = require('connect-session-sequelize')(session.Store)
const { db, Action, Session } = require('../db')
// const sessionStore = new SequelizeStore({db})

const crypto = require("crypto");

// app.use(morgan('dev'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    next();
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/data', (req, res, next) => {
    console.log('SESSION CHECK', req.originalUrl, req.body.session || 'NOT YET CREATED');
    if(req.body.session && req.body.session.includes('sessionId')){
        req.body.session = req.body.session.slice(10);
    } else {
        console.log('GENERATING NEW SESSION', req.body.session);
        req.body.session = crypto.randomBytes(20).toString('hex');
    }
    Session.findOrCreate({
        where: {
            id: req.body.session
        }
    })
    .then(([session, created]) => {
        if(created) console.log('SESSION CREATION', session.id, req.originalUrl);
        req.session = session;
        req.body = req.body.payload;
        next();
    })
    .catch(next);

})

// app.use(session({
//     secret: process.env.SESSION_SECRET || 'server defau lt secret',
//     store: sessionStore,
//     resave: false,
//     saveUninitialized: true
// }))

// app.use((req, res, next) => {
//     console.log('THIS WAS HIT', req.session.id);
//     next(); 
// })

app.post('/data', (req, res, next) => {
    // console.log(req.session.id, req.body);
    Action.create({
        type: req.body.type.toUpperCase(),
        path: req.body.path,
        info: req.body.info || {},
        sessionId: req.session.id
    }).then(action => {
        res.send({sessionId: req.session.id});
    })
})

app.use('/', (req, res, next) => {
    // console.log('this was hit');
    res.sendFile(path.join(__dirname, '../public/bundle.js'));
})

/*


app.use(session({
    secret: process.env.SESSION_SECRET || 'my best friend is Cody',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
  }))



*/

module.exports = app;