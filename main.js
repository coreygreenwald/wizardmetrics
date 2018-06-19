const server = require('./server');
const { db, Customer } = require('./db');
db.sync()
    .then(() => {
        server.listen(process.env.PORT || 3000, () => console.log('server running on port 5000s'));
        // Customer.retrieveJourneyInfo('SpencerBratman66057d78')
    })
    .catch(console.error)
