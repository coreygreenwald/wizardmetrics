const router = require('express').Router()
const { Journey, Conversion } = require('../../../db');

router.get('/', async (req, res, next) => {
    try {
        if(req.customer){
            let conversions = await Conversion.findAll({
                where: {
                    customerPublicId: req.customer.publicId
                }
            })
            if(conversions.length){
                res.json(conversions);
            } else {
                res.status(404).send('Conversions Not Found');
            }
        } else {
            res.status(403).send('Forbidden');
        }
    } catch(err){
        next(err); 
    }
});

router.post('/', (req, res, next) => {
    if(req.customer){
        const conversion = req.body;
        conversion.customerPublicId = req.customer.publicId;
        Conversion.create(conversion)
            .then(conversion => {
                res.send(conversion);
            })
            .catch(next);
    } else {
        res.status(403).send('Forbidden'); 
    }
})

router.delete('/:id', async (req, res ,next) => {
    try {
        if(req.customer){
            let conversion = await Conversion.findById(+req.params.id);
            if(req.customer.status === 'SUPER_ADMIN' || conversion.customerPublicId === req.customer.publicId){
                await conversion.destroy();
                res.send('Conversion Successfully Deleted');
            } else {
                res.status(403).send('Forbidden');
            }
        } else {
            res.status(403).send('Forbidden');
        }
    } catch(err){
        next(err); 
    }
})

router.get('/:id/actions', (req, res, next) => {
    if(req.customer){
        Action.findAll({
            where: {
                conversionId: Number(req.params.id)
            }
        }).then(actions => {
            res.json(actions);
        })
    } else {
        res.status(403).send('Forbidden'); 
    }
})


module.exports = router;