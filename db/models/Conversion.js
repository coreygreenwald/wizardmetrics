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
    let matchDataKeys = Object.keys(this.matchData);
    return (action.type === this.type && action.path === this.path && (matchDataKeys.length > 0 ? (matchDataKeys.reduce((prev, key) => {
        if(prev && this.matchData[key] === action.info[key]){
            return true; 
        } 
        return false;
    }, true))
    : true));
}

module.exports = Conversion;
