require('dotenv').config()

// Custom middleware for PRIVATE AND PROTECTED ROUTES
// WHich we can use to identify if the requests are coming from us

module.exports = function (req, res, next) {
  // Get key from header

  // const key = req.header('x-auth-key')

  // check if no key

  // if (!key) {
  //   return res.status(401).json({ msg: 'No key, authorization denied' })
  // } else if (key && key !== process.env.MLD_NODE_KEY) {
  //   return res.status(401).json({ msg: 'No key, authorization denied' })
  // } else if (key && key === process.env.MLD_NODE_KEY) {
  //   next()
  // }

  next()

  // call next to continue to the next middleware with the new validated user in req object
}
