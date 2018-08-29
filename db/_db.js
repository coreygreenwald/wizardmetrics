var Sequelize = require('sequelize');

var db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/wizard_clone', {
  dialect: 'postgres',
  logging: false
});

module.exports = db;