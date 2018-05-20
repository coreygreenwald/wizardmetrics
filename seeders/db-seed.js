const { db, Customer, Session, Action } = require('../db');

db.sync({force: true})
    .then(() => {
        return Customer.create({
            name: "SmiteMaster",
            location: "401 E 68th Street",
            password: 'password123'
        })
    })
    .catch((err) => {
        console.log('THERE WAS AN ERROR', err)
    })