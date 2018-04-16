const db = require('../_db');
const Sequelize = require('sequelize');

const Action = db.define('action', {
    actionType: {
        type: Sequelize.ENUM('ARRIVAL', 'CLICK', 'INPUT', 'OTHER'),
        defaultValue: 'OTHER'
    },
    value: {
        type: Sequelize.STRING
    }
})

module.exports = Action;
