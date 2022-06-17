const redis = require('redis')

const redisClient = redis.createClient(process.env.REDIS_PORT)
redisClient.connect()

module.exports = redisClient
