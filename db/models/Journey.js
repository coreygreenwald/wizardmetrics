const db = require('../_db');
const Sequelize = require('sequelize');

const Journey = db.define('journey', {
    info: {
        type: Sequelize.JSONB
    },
    completedJourneys: {
        type: Sequelize.INTEGER
    },
    totalJourneys: {
        type: Sequelize.INTEGER
    }, 
    shortestJourneyTime: {
        type: Sequelize.FLOAT
    },
    shortestJourneyByTime: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    shortestJourneyLength: {
        type: Sequelize.INTEGER
    },
    shortestJourneyByLength: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    day: {
        type: Sequelize.DATEONLY
    }
})

module.exports = Journey; 