const db = require('../_db');
const Sequelize = require('sequelize');

const Session = db.define('session', {
    id: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true
    }
})

module.exports = Session;
