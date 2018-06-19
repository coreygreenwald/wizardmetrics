const db = require('../_db');
const Sequelize = require('sequelize');

const Conversion = db.define('conversion', {
    type: {
        type: Sequelize.ENUM('ARRIVAL', 'CLICK', 'INPUT', 'OTHER'),
        defaultValue: 'OTHER'
    },
    path: {
        type: Sequelize.STRING
    },
    matchData: {
        type: Sequelize.JSONB
    }
})

Conversion.prototype.compareActionToConversion = function(action){
    return action.type === this.type 
    && action.path === this.path 
    && Object.keys(this.matchData).reduce((prev, key) => {
        if(prev && this.matchData[key] === action.info[key]){
            return true; 
        } 
        return false;
    }, true)
}

module.exports = Conversion;
