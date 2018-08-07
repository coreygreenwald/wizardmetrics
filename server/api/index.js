const express = require('express');
const router = express.Router();
const client = require('../../cache');

router.use((req, res, next) => {
    //DO API KEY LOGIC HERE
    next(); 
})

router.get('/', (req, res, next) => {
    if(req.query.api_key){
        res.send({
            name: 'testing',
            value: 'does this work'
        })
    } else {
        res.status(401).send('Unauthorized');
    }
})

router.get('/TEST', (req, res, next) => {
    client.actions.getObj('SmiteMaster828a:12:IMPACT-MOST')
        .then((thing) => {
            res.send(thing);
        })
        .catch(next);
})

module.exports = router;
