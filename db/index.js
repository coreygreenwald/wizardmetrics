const db = require('./_db');
const Session = require('./models/Session');
const Action = require('./models/Action');
const Customer = require('./models/Customer');

Action.belongsTo(Session);
Session.belongsTo(Customer);

Session.hasMany(Action);
Customer.hasMany(Session);

module.exports = {
    db,
    Session,
    Action,
    Customer
}


// const fs        = require('fs');
// const path      = require('path');
// const Sequelize = require('sequelize');
// const basename  = path.basename(module.filename);
// const env       = process.env.NODE_ENV || 'development';
// const config    = require(__dirname + '/../config/config.json')[env];
// const db        = {};

// let sequelize; 
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable]);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// let root = path.join(__dirname, './models');
// fs
//   .readdirSync(root)
//   .filter(function(file) {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(function(file) {
//     var model = sequelize['import'](path.join(root, file));
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(function(modelName) {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.db = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
