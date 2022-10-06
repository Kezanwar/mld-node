const _redis = require('./redis')

const getRedisJSON = (key) => {
  return new Promise(async (resolve, reject) => {
    try {
      let item = await _redis.get(key)
      item = JSON.parse(item)
      resolve(item)
    } catch (error) {
      reject()
      throw new Error(error)
    }
  })
}

module.exports = {
  getRedisJSON,
}
