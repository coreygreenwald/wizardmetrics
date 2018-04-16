const server = require('./server');
const { db } = require('./db');
db.sync({force: true})
    .then(() => {
        server.listen(3000, () => console.log('server running on port 3000'));
    })
    .catch(console.error)
