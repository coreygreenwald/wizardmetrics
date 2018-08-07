const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);

client.on('error', (err) => {
    console.log('Redis had an error!', err);
})

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

