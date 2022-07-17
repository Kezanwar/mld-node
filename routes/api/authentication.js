const express = require('express')
const router = express.Router()
const _wp = require('../../utilities/wp')
const axios = require('axios')

// middleware
const MLDauth = require('../../middleware/MLDauth')

router.get('/users', MLDauth, async (req, res) => {
  try {
    const users = await axios.get(`${_wp.URL}/wp-json/wp/v2/users`, {
      headers: _wp.HEADERS(),
    })
    res.send(users.data)
  } catch (error) {
    console.log(error)
    res.send('error')
  }
})

const stackoverflowinfo =
  'https://stackoverflow.com/questions/31364971/endpoint-for-user-login-signup-in-woocommerce-rest-api-v2'

module.exports = router
