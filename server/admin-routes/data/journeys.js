const router = require('express').Router()
const { Journey } = require('../../../db');

router.get('/', (req, res, next) => {
    if(req.customer){
        Journey.findAll({
            limit: 1,
            where: {
              customerPublicId: req.customer.publicId
            },
            order: [ [ 'createdAt', 'DESC' ]]
          }).then(([journey]) => {
              if(journey){
                res.json(journey);
              } else {
                res.send('No data yet!'); 
              }
          }).catch(next);
    } else {
        res.status(403).send('Action Forbidden!');
    }
})

module.exports = router;