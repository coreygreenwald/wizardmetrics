const router = require('express').Router()
const { Journey } = require('../../../db');
const client = require('../../../cache');


router.get('/', async (req, res, next) => {
    // && req.query.model
    if(req.customer){
        try {
            let recentJourney = await client.actions.getObj(`${req.customer.username}:JOURNEY:RECENT`);
            //Fallback to making the query just to ensure there's no cached data.
            if(!recentJourney || !Object.keys(recentJourney).length){
                [recentJourney] = await Journey.findAll({
                    limit: 1,
                    where: {
                        customerPublicId: req.customer.publicId
                    },
                    order: [ [ 'createdAt', 'DESC' ]]
                })
            }
            if(recentJourney){
                res.send(recentJourney); 
            } else {
                res.status(404).send('No Data Yet!')
            }
        } catch(err){
            next(err);
        }
        

        // client.actions.getObj(`${req.customer.username}:12:IMPACT-MOST`)
        
        // Journey.findAll({
        //     limit: 1,
        //     where: {
        //       customerPublicId: req.customer.publicId
        //     },
        //     order: [ [ 'createdAt', 'DESC' ]]
        //   }).then(([journey]) => {
        //       console.log(journey)
        //       if(journey){
        //         res.json(journey);
        //       } else {
        //         res.send('No data yet!'); 
        //       }
        //   }).catch(next);
    } else {
        res.status(403).send('Action Forbidden!');
    }
})

module.exports = router;