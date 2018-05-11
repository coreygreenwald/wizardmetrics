const server = require('./server');
const { db } = require('./db');
db.sync()
    .then(() => {
        server.listen(5000, () => console.log('server running on port 500'));
    })
    .catch(console.error)
