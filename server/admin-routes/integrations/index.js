const router = require('express').Router()
const { APIKey, Integration } = require('../../../db');

router.get('/:appName/key', async (req, res, next) => {
    try {
        if(req.customer){
            const integration = await Integration.findOne({where: {
                platform: req.params.appName.toUpperCase()
            }})
            if(!integration) res.status(404).send('Integration Not Supported');
            const [apiKeyObj] = await APIKey.findOrCreate({
                where: {
                    customerPublicId: req.customer.publicId,
                    integrationId: integration.id
                }
            })
            res.send(apiKeyObj.key);
        } else {
            res.status(403).send('You Must Be Logged in To Do This!')
        }
    } catch(err){
        next(err);
    }
})

module.exports = router; 