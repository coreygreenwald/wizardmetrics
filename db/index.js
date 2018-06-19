const db = require('./_db');
const Session = require('./models/Session');
const Action = require('./models/Action');
const Customer = require('./models/Customer');
const Conversion = require('./models/Conversion');

Action.belongsTo(Session);
Session.belongsTo(Customer);

Session.hasMany(Action);
Customer.hasMany(Session);

Conversion.belongsTo(Customer);
Customer.hasMany(Conversion);

Action.belongsTo(Conversion);

module.exports = {
    db,
    Session,
    Action,
    Customer,
    Conversion
}
