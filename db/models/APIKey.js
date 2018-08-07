const db = require('../_db');
const Sequelize = require('sequelize');
const crypto = require('crypto');

const APIKey = db.define('api_key', {
    key: {
        type: Sequelize.STRING,
        allowNull: false,  
        validate: {
            notEmpty: true 
        }
    }
})

APIKey.beforeValidate((instance) => {
    instance.key = crypto.randomBytes(12).toString('hex');
})

module.exports = APIKey;