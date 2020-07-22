const mongoose = require('mongoose')
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379'
const client = redis.createClient(redisUrl)
const util = require('util')
client.get = util.promisify(client.get)

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
    console.log('I AM ABOUT TO RUN A QUERY')

    const key = JSON.stringify(Object.assign({},this.getQuery(), {
        collection: this.mongooseCollection.name
    }))

        const cachedBlogs = await client.get(key)
        if(cachedBlogs) {
            console.log('Serving from Redis')
        } else {
            console.log('Run from mongoDB')
        }
    const result = await exec.apply(this,arguments)
    client.set(key,JSON.stringify(result),'EX',10)
    return result
}