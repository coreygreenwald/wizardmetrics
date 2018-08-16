const db = require('../_db');
const Sequelize = require('sequelize');

const Conversion = db.define('conversion', {
    type: {
        type: Sequelize.ENUM('ARRIVAL', 'CLICK', 'NAVIGATE', 'INPUT', 'OTHER'),
        defaultValue: 'OTHER'
    },
    path: {
        type: Sequelize.STRING
    },
    matchData: {
        type: Sequelize.JSONB
    },
    strength: {
        type: Sequelize.ENUM('SOFT', 'HARD'),
        defaultValue: 'SOFT'
    }
})

Conversion.prototype.compareActionToConversion = function(action){
    delete this.matchData.strength;
    let matchDataKeys = Object.keys(this.matchData);
    return (action.type === this.type && pathMatcher(this.path, action.path) && (matchDataKeys.length > 0 ? (matchDataKeys.reduce((prev, key) => {
        if(prev && this.matchData[key] === action.info[key]){
            return true; 
        } 
        return false;
    }, true))
    : true));
}

function pathMatcher(conversionPath, actionPath){
    let cPath = conversionPath.slice(1).split('/');
    let aPath = actionPath.slice(1).split('/'); 
    if(cPath.length !== aPath.length) return false;
    for(let i = 0; i < cPath.length; i++){
        if(!cPath[i].startsWith(':') && cPath[i] !== aPath[i]){
            return false;   
        }
    }
    return true; 
}

module.exports = Conversion;
