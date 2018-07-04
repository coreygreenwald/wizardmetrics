const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { db, Action, Session } = require('../db')

const crypto = require("crypto");

app.use(morgan('dev'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    next();
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/plugin', require('./plugin-routes'));
app.use('/admin', require('./admin-routes'));

app.use(express.static(path.join(__dirname, '../public/admin')))

app.use('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public/admin/index.html'));
})

module.exports = app;