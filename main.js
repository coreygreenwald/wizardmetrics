const server = require('./server');
const { db } = require('./db');
db.sync()
    .then(() => {
        server.listen(process.env.PORT || 3000, () => console.log('server running on port 5000s'));
    })
    .catch(console.error)
