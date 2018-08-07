const db = require('../_db');
const Sequelize = require('sequelize');

const Integration = db.define('integration', {
    platform: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    permissions: {
        type: Sequelize.ENUM('READ', 'WRITE', 'READ/WRITE'),
        defaultValue: 'READ'
    }
})

module.exports = Integration;