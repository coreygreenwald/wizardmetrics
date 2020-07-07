const express = require('express');
const router = express.Router();
const client = require('../../cache');

//This is the begining of testing for work with external APIs and use with Zapier.
// router.get('/', (req, res, next) => {
//     if(req.query.api_key){
//         res.send({
//             name: 'testing',
//             value: 'does this work'
//         })
//     } else {
//         res.status(401).send('Unauthorized');
//     }
// })

//This route is here for testing purposes only
//Note how information is retrieved from the cache.

// router.get('/TEST', (req, res, next) => {
//     client.actions.getObj('SmiteMaster828a:12:IMPACT-MOST')
//         .then((thing) => {
//             res.send(thing);
//         })
//         .catch(next);
// })

module.exports = router;
