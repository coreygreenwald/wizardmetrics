const db = require('../_db');
const Sequelize = require('sequelize');

const Action = db.define('action', {
    type: {
        type: Sequelize.ENUM('ARRIVAL', 'CLICK', 'INPUT', 'OTHER'),
        defaultValue: 'OTHER'
    },
    path: {
        type: Sequelize.STRING
    },
    info: {
        type: Sequelize.JSONB
    }
})

module.exports = Action;
