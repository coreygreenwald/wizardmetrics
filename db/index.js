const db = require('./_db');
const Session = require('./models/Session');
const Action = require('./models/Action');
const Customer = require('./models/Customer');
const Conversion = require('./models/Conversion');
const Journey = require('./models/Journey');
const Integration = require('./models/Integration');
const APIKey = require('./models/APIKey');

Action.belongsTo(Session);
Session.belongsTo(Customer);

Session.hasMany(Action);
Customer.hasMany(Session);

Conversion.belongsTo(Customer);
Customer.hasMany(Conversion);

Journey.belongsTo(Customer);
Customer.hasMany(Journey);

Action.belongsTo(Conversion);

APIKey.belongsTo(Customer);
APIKey.belongsTo(Integration);

module.exports = {
    db,
    Session,
    Action,
    Customer,
    Conversion,
    Journey,
    APIKey,
    Integration
}
