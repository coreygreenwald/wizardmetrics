const server = require('./server');
const { db, Customer, Conversion } = require('./db');
db.sync()
    .then(() => {
        server.listen(process.env.PORT || 3000, () => console.log('server running on port 5000s'));
        // Customer.retrieveJourneyInfo('SpencerBratman66057d78')
        // Conversion.create({
        //     type: 'CLICK',
        //     path: '/stats',
        //     matchData: {},
        //     customerPublicId: '6d296e1c76c75e69efca2a6ea24036a30c029ceb'
        // })
    })
    .catch(console.error)
