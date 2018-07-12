const { db, Customer, Session, Action, Conversion } = require('../db');

db.sync({force: true})
    .then(() => {
        return Customer.create({
            name: "SmiteMaster",
            location: "401 E 68th Street",
            password: 'password123'
        })
    })
    .then((customer1) => {
        return Conversion.create({
            type: 'ARRIVAL',
            path: '/gods',
            matchData: {},
            strength: 'HARD',
            customerPublicId: customer1.publicId
        })
    })
    .then(() => {
        return Customer.create({
            name: "SpencerBratman",
            location: "Random Address",
            password: 'random123'
        })
    })
    .catch((err) => {
        console.log('THERE WAS AN ERROR', err)
    })
    .finally(() => db.close())
