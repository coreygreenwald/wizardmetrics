const express = require('express');
const router = express.Router();

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

module.exports = router;
