const { db, Customer, Session, Action, Conversion, Journey, Integration } = require('../db');

db.sync({force: true})
    .then(() => {
        return Customer.create({
            name: "DemoAccount",
            location: "Demo Demo Pl. Demo, NY, 10065",
            password: 'demo_account',
            status: 'ALL',
            originURL: 'https://www.demodemo.com'
        })
    })
    .then((demoCustomer) => {
        return Promise.all(
            [ 
                Conversion.create({
                    type: 'ARRIVAL',
                    path: '/order-confirmation',
                    matchData: {},
                    strength: 'HARD',
                    customerPublicId: demoCustomer.publicId
                }),
                Journey.create({
                    totalJourneys: 14688,
                    completedJourneys: 1993,
                    shortestJourneyTime: 107,
                    shortestJourneyByTime: [43, 11, 16, 33, 123],
                    shortestJourneyLength: 4,
                    shortestJourneyByLength: [111, 12, 13, 22],
                    dayString: '072518',
                    info: require('./sampleJourneyInfo.json'),
                    customerPublicId: demoCustomer.publicId
                })
        ])
    })
    .then(() => {
        return Customer.create({
            name: "SmiteMaster",
            location: "401 E 68th Street",
            password: 'password123',
            originURL: 'https://www.smite-stats.herokuapp.com'
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
            password: 'random123',
            status: 'SUPER_ADMIN',
            originURL: 'https://www.degreescoop.com'
        })
    })
    .then(() => {
        return Integration.create({
            platform: 'ZAPIER',
            permissions: 'READ'
        })
    })
    .catch((err) => {
        console.log('THERE WAS AN ERROR', err)
    })
    .finally(() => db.close())
