const db = require('../_db');
const Sequelize = require('sequelize');
const crypto = require('crypto'); 

const Customer = db.define('customer', {
    publicId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    privateId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    location: {
        type: Sequelize.STRING, 
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        defaultValue: 'password123'
    }
})

Customer.addHook('beforeValidate', (customer) => {
    customer.publicId = crypto.randomBytes(20).toString('hex');
    customer.privateId = customer.name + crypto.randomBytes(4).toString('hex');
})

module.exports = Customer;
