const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL || {});
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);

client.on('error', (err) => {
    console.log('Redis had an error!', err);
})

//This custom getter/setter allows for generalized access and standardization across the application.
//All uses of redis will go through these two endpoints. 

client.actions = {
    setObj: (name, obj) => {
        return client.setAsync(name, JSON.stringify(obj));
    },
    getObj: (name) => {
        return client.getAsync(name)
            .then(string => {
                return JSON.parse(string);
            })
    }
}

module.exports = client;

