const db = require('../_db');
const Sequelize = require('sequelize');
const crypto = require('crypto'); 

const Customer = db.define('customer', {
    publicId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    username: {
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
    },
    salt: {
        type: Sequelize.STRING,
    }
})

Customer.prototype.validatePassword = function (candidatePwd) {
    return Customer.encryptPassword(candidatePwd, this.salt) === this.password
}

Customer.generateSalt = function () {
    return crypto.randomBytes(16).toString('base64')
}

Customer.encryptPassword = function (plainText, salt) {
    return crypto.createHash('RSA-SHA256').update(plainText).update(salt).digest('hex')
}

const setSaltAndPassword = customer => {
    if (customer.changed('password')) {
        customer.salt = Customer.generateSalt()
        customer.password = Customer.encryptPassword(customer.password, customer.salt)
    }
}

Customer.addHook('beforeValidate', (customer) => {
    customer.publicId = crypto.randomBytes(20).toString('hex');
    customer.username = customer.name + crypto.randomBytes(4).toString('hex');
})

Customer.beforeCreate(setSaltAndPassword)
Customer.beforeUpdate(setSaltAndPassword)

module.exports = Customer;