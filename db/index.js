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
